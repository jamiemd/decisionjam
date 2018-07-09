const passport = require("passport");
const Decision = require("../db/DecisionModel");

const STATUS_USER_ERROR = 422;
const STATUS_SERVER_ERROR = 500;
const STATUS_OKAY = 200;
const STATUS_NOT_FOUND = 404;

module.exports = app => {
  // create decision
  app.post(
    "/api/create-decision",
    passport.authenticate("jwt", { session: false }),
    function(req, res) {
      let decisionCode = "";
      Decision.findOne(
        {
          decisonCode: (decisionCode = Math.random()
            .toString(36)
            .substr(2, 5))
        },
        function(err, duplicate) {
          if (err) {
            console.log("err", err);
            res.status(STATUS_USER_ERROR).json({ message: "Search error" });
          }
          if (duplicate) {
            console.log("duplicate", duplicate);
          }
        }
      );
      // save new decision code
      const newDecision = new Decision(req.body);
      newDecision.decisionCode = decisionCode;
      newDecision.decisionCreatorUsername = req.user.username;
      newDecision.save((err, decision) => {
        if (err) {
          console.log("err", err);
          res.status(STATUS_USER_ERROR).json({ error: "Error while adding" });
        } else {
          console.log("decision", decision);
          res.status(STATUS_OKAY).json({ decision: decision });
        }
      });
    }
  );

  // find decision
  app.get(
    "/api/find-decision/:decisionCode",
    passport.authenticate("jwt", { session: false }),
    function(req, res) {
      // console.log("req.params", req.params);
      // console.log("req.user", req.user);
      const decisionCode = req.params.decisionCode;
      Decision.findOne({ decisionCode: decisionCode }).then(
        decision => {
          // console.log("decision", decision);
          if (decision.decisionCreatorUsername === req.user.username) {
            res.status(STATUS_OKAY).json({ decision, isCreator: true });
          } else res.status(STATUS_OKAY).json({ decision, isCreator: false });
        },
        err => {
          // console.log("err", err);
          res.status(STATUS_NOT_FOUND).json({ message: err });
        }
      );
    }
  );

  // get answers
  app.get("/api/get-answers/:decisionCode", function(req, res) {
    const decisionCode = req.params.decisionCode;
    console.log("decisionCode", decisionCode);
    Decision.findOne({ decisionCode: decisionCode }).then(answer => {
      console.log("answer", answer);
      res.status(STATUS_OKAY).json(answer),
        error => {
          res.status(STATUS_NOT_FOUND).json({
            message: error
          });
        };
    });
  });

  // create answer and return answers array
  app.put("/api/create-answer/:decisionCode", function(req, res) {
    const decisionCode = req.params.decisionCode;
    const newAnswer = req.body.answer;
    // console.log("req.body", req.body);
    if (!newAnswer) {
      res.status(STATUS_USER_ERROR);
    } else {
      Decision.findOne({ decisionCode: decisionCode }).then(
        decision => {
          let currentAnswers = decision.answers;
          if (currentAnswers === undefined) {
            currentAnswers = [{ answerText: newAnswer }];
          } else {
            currentAnswers.push({ answerText: newAnswer });
          }
          Decision.updateOne(
            { decisionCode: decisionCode },
            { $set: { answers: currentAnswers } }
          ).then(result => {
            // console.log("decision", decision);
            res.status(STATUS_OKAY).json(decision),
              error => {
                res.status(STATUS_NOT_FOUND).json({
                  message: error
                });
              };
          });
        },
        error => {
          res.status(STATUS_NOT_FOUND).json({
            message: error
          });
        }
      );
    }
  });

  function userVotes(decision, user) {
    // console.log("decision", decision);
    // console.log("decision.answers", decision.answers);
    // console.log("user", user);
    const allUsers = decision.answers.map(a => [...a.upVotes, ...a.downVotes]);
    // console.log("allUsers", allUsers);
    const flattenedUsers = [].concat.apply([], allUsers);
    // console.log("flattenedUsers", flattenedUsers);

    // const votes = flattenedUsers.find(u => u === user);

    const votes = flattenedUsers.filter(u => u === user);

    // console.log("votes", votes);
    // console.log("votes.length", votes.length);
    return votes === undefined ? 0 : votes.length;
  }

  app.put(
    "/api/decision/answer/:id/vote",
    passport.authenticate("jwt", { session: false }),
    function(req, res) {
      // console.log("req", req);
      const answerId = req.params.id;
      const vote = req.query.vote;
      const userId = req.user.username;
      // console.log("answerId", answerId);
      // console.log("vote", vote);
      // console.log("userId", userId);

      if (
        vote === undefined ||
        (vote.toUpperCase() !== "YES" && vote.toUpperCase() !== "NO")
      ) {
        res
          .status(STATUS_USER_ERROR)
          .json({ error: "Decision must be yes or no" });
      } else {
        Decision.findOne({ "answers._id": answerId })
          .then(
            decision => {
              const currentVotes = userVotes(decision, userId);
              // console.log("decision", decision);
              console.log("decision.answers", decision.answers);
              let answers = decision.answers;
              const voteForAnswer = answers.find(
                x => String(x._id) === answerId
              );
              const upVotes = voteForAnswer.upVotes;
              const downVotes = voteForAnswer.downVotes;

              console.log("voteForAnswer", voteForAnswer);
              var voted = false;
              if (
                vote.toUpperCase() === "YES" &&
                currentVotes < decision.maxVotesPerUser
              ) {
                upVotes.push(userId);
                voted = true;
              } else if (
                vote.toUpperCase() === "NO" &&
                currentVotes < decision.maxVotesPerUser
              ) {
                downVotes.push(userId);
                voted = true;
              }
              if (voted) {
                decision.save().then(d => {
                  console.log("votesbyobectuser", {
                    ...d.toObject(),
                    votesByUser: userVotes(d, userId)
                  });
                  res.status(STATUS_OKAY).json({
                    ...d.toObject(),
                    votesByUser: userVotes(d, userId)
                  }),
                    err => {
                      res.status(STATUS_SERVER_ERROR).json({ error: err });
                    };
                });
              } else {
                res.status(STATUS_USER_ERROR).json({
                  status:
                    "User already exceeds max vote count not allowed to vote again"
                });
              }
            },
            err =>
              res
                .status(STATUS_NOT_FOUND)
                .json({ error: "answer with id " + answerId + " not found" })
          )
          .catch(e => console.log(e));
      }
    }
  );

  // when react wants to change voteOver from false to true
  app.put(
    "/api/decision/:decisionCode/voteOverUpdate",
    passport.authenticate("jwt", { session: false }),
    function(req, res) {
      // console.log("req", req);
      const decisionCode = req.params.decisionCode;
      // console.log("id", decisionCode);
      console.log(`req.body ${req.body.voteOver}`);
      const voteOver = req.body.voteOver; //TODO add with the user id right now only string
      //check if string answer is empty or null
      // https://stackoverflow.com/questions/154059/how-do-you-check-for-an-empty-string-in-javascript
      console.log("voteOver", voteOver);
      Decision.findOne({ decisionCode }).then(
        decision => {
          console.log("decision in voteover update", decision);
          decision.voteOver = true;
          Decision.updateOne({ decisionCode }, { $set: { voteOver } }).then(
            result => res.status(STATUS_OKAY).json(decision),
            err =>
              res.status(STATUS_NOT_FOUND).json({
                error: "Decision with id " + id + " not updated" + " " + err
              })
          );
        },
        err =>
          res
            .status(STATUS_NOT_FOUND)
            .json({ error: "Decision with id " + id + " not found" })
      );
    }
  );

  app.put(
    "/api/decision/:decisionCode/maxVotesPerUser",
    passport.authenticate("jwt", { session: false }),
    function(req, res) {
      const decisionCode = req.params.decisionCode;
      const newValue = req.query.newValue;
      // console.log("newValue", newValue);

      Decision.findOne({ decisionCode }).then(decision => {
        if (decision.decisionCreatorId === String(req.user._id)) {
          Decision.updateOne(
            { decisionCode },
            { $set: { maxVotesPerUser: newValue } }
          ).then(
            d => res.status(STATUS_OKAY).json(decision),
            e =>
              res
                .status(STATUS_SERVER_ERROR)
                .json({ error: "FAiled to update max votes" + " " + e })
          );
        } else {
          res
            .status(STATUS_USER_ERROR)
            .json({ error: "FAiled to update max votes user is not owner" });
        }
      });
    }
  );
};
