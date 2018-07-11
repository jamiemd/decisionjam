const passport = require("passport");
const Decision = require("../db/DecisionModel");

const STATUS_USER_ERROR = 422;
const STATUS_SERVER_ERROR = 500;
const STATUS_OKAY = 200;
const STATUS_NOT_FOUND = 404;

let maxVotesCount = 0;

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
            // console.log("duplicate", duplicate);
          }
        }
      );
      // save new decision code
      const newDecision = new Decision(req.body);
      newDecision.decisionCode = decisionCode;
      newDecision.decisionCreatorUsername = req.user.username;
      newDecision.save((err, decision) => {
        if (err) {
          // console.log("err", err);
          res.status(STATUS_USER_ERROR).json({ error: "Error while adding" });
        } else {
          // console.log("decision", decision);
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
    Decision.findOne({ decisionCode: decisionCode }).then(answer => {
      res.status(STATUS_OKAY).json(answer),
        error => {
          res.status(STATUS_NOT_FOUND).json({
            message: error
          });
        };
    });
  });

  // create answer and return answers array
  app.put("/api/post-answer/:decisionCode", function(req, res) {
    const decisionCode = req.params.decisionCode;
    const newAnswer = req.body.answer;
    console.log("req.body", req.body);
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

  // handle vote
  app.put(
    "/api/handleVote",
    passport.authenticate("jwt", { session: false }),
    function(req, res) {
      // console.log("req.body", req.body);
      const vote = req.body.voteData.vote;
      const answerId = req.body.voteData.answerId;

      // can't have more than one vote per answer
      // second tap on upvote cancels the upvote and vice versa for downvote
      // if upVote, add to upVotes array, same for downvote for downvotes array
      // add vote based on answerId
      // based on max votes, set max votes for each userid

      if (vote === undefined) {
        res.status(STATUS_USER_ERROR).json({ message: "Error" });
      } else {
        Decision.findOne({ "answers._id": answerId })
          .then(
            decision => {
              // console.log("decision", decision);
            },
            error => {
              console.log("err", error);
              res
                .status(STATUS_NOT_FOUND)
                .json({ error: "answer with id " + answerId + " not found" });
            }
          )
          .catch(error => {
            console.log(error);
          });
      }
    }
  );

  // set max votes
  app.put(
    "/api/set-maxVote",
    passport.authenticate("jwt", { session: false }),
    function(req, res) {
      console.log("req.body", req.body);
      const decisionCode = req.body.maxVotesData.decisionCode;
      const maxVotes = req.body.maxVotesData.maxVotes;
      console.log("maxvotes", maxVotes);

      if (maxVotes === -1) {
        maxVotesCount--;
      } else if (maxVotes === 1) {
        maxVotesCount++;
      }

      console.log("maxvotecount", maxVotesCount);

      // Decision.findOne({ decisionCode: decisionCode }).then(decision => {
      //   // console.log("decision set maxvotes", decision);
      //   if (decision.decisionCreatorUsername === req.user.username) {
      //     Decision.updateOne(
      //       { decisionCode },
      //       { $set: { maxVotesPerUser: maxVotes } }
      //     ).then(
      //       decision => {
      //         res.status(STATUS_OKAY).json(decision);
      //       },
      //       error => {
      //         res.status(STATUS_SERVER_ERROR).json({ error: error });
      //       }
      //     );
      //   } else {
      //     res
      //       .status(STATUS_USER_ERROR)
      //       .json({ error: "Failed to update max votes user is not owner" });
      //   }
      // });
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
};
