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
    "/api/find-decision/:id",
    passport.authenticate("jwt", { session: false }),
    function(req, res) {
      console.log("req.params", req.params);
      const decisionCode = req.params.id;
      Decision.findOne({ decisionCode: decisionCode }).then(
        decision => {
          console.log("decision", decision);
          res.status(STATUS_OKAY).json(decision);
        },
        err => {
          console.log("err", err);
          res.status(STATUS_NOT_FOUND).json({ message: err });
        }
      );
    }
  );

  // find decision
  app.get(
    "/api/decision/decisionCode/:decisionCode",
    passport.authenticate("jwt", { session: false }),
    function(req, res) {
      const currentLoggedInUserId = req.user
        ? req.user._id
        : "5b01aeb1abaade1eacdc67ce";
      const decisionCode = req.params.decisionCode;

      Decision.updateOne(
        { decisionCode },
        { $set: { currentLoggedInUserId } }
      ).then(
        result => {
          console.log("result", result);
          Decision.findOne({ decisionCode }).then(decision => {
            console.log("decision", decision);
            res.status(STATUS_OKAY).json({ decision });
          });
        },
        err => {
          console.log("err", err);
          res.status(STATUS_NOT_FOUND).json({
            error: "Decision with id " + id + " not updated" + " " + err
          });
        }
      );
    }
  );

  app.put("/api/decision/:id/answer", function(req, res) {
    const id = req.params.id;
    console.log("id", id);
    console.log(`req.body ${req.body.answer}`);
    const answer = req.body.answer; //TODO add with the user id right now only string
    //check if string answer is empty or null
    // https://stackoverflow.com/questions/154059/how-do-you-check-for-an-empty-string-in-javascript
    console.log("answer", answer);
    if (!answer) {
      console.log("answer is blank or undefined");
      res.status(STATUS_USER_ERROR).json({ error: "Answer cannot be blank" });
    } else {
      Decision.findOne({ decisionCode: id }).then(
        decision => {
          console.log("decision.answers", decision.answers);
          let answers = decision.answers;
          if (answers === undefined) {
            answers = [{ answerText: answer }];
          } else {
            answers.push({ answerText: answer });
          }
          Decision.updateOne(
            { decisionCode: id },
            { $set: { answers: answers } }
          ).then(result => {
            res
              .status(STATUS_OKAY)
              .json({ ...decision.toObject(), votesByUser: 0 }),
              err =>
                res.status(STATUS_NOT_FOUND).json({
                  error: "Decision with id " + id + " not updated" + " " + err
                });
          });
        },
        err =>
          res
            .status(STATUS_NOT_FOUND)
            .json({ error: "Decision with id " + id + " not found" })
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
