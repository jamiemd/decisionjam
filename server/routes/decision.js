const passport = require("passport");
const Decision = require("../db/DecisionModel");

const STATUS_USER_ERROR = 422;
const STATUS_SERVER_ERROR = 500;
const STATUS_OKAY = 200;
const STATUS_NOT_FOUND = 404;

let maxVotes = 0;

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
    // console.log("getanswers route called");
    const decisionCode = req.params.decisionCode;
    Decision.findOne({ decisionCode: decisionCode }).then(decision => {
      // console.log("decision.answers", decision.answers);
      res.status(STATUS_OKAY).json(decision.answers),
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

  // handle vote
  app.put(
    "/api/handleVote",
    passport.authenticate("jwt", { session: false }),
    function(req, res) {
      const userName = req.user.username;
      const vote = req.body.voteData.vote;
      const answerId = req.body.voteData.answerId;
      if (vote === undefined) {
        res.status(STATUS_USER_ERROR).json({ message: "Error" });
      } else {
        Decision.findOne({ "answers._id": answerId }).then(
          decision => {
            // get answer index
            let answerIndex;
            for (let i = 0; i < decision.answers.length; i++) {
              if (decision.answers[i]._id.toString() === answerId) {
                answerIndex = i;
              }
            }

            let upVotesArray = decision.answers[answerIndex].upVotes;
            let downVotesArray = decision.answers[answerIndex].downVotes;

            console.log("decision.answers before", decision.answers);

            // get userName count
            let count = 0;
            for (let i = 0; i < decision.answers.length; i++) {
              for (let j = 0; j < decision.answers[j].upVotes.length; j++) {
                if (decision.answers[i].upVotes[j] === userName) {
                  count++;
                }
              }
              for (let k = 0; k < decision.answers[k].downVotes.length; k++) {
                if (decision.answers[i].downVotes[k] === userName) {
                  count++;
                }
              }
            }
            console.log("count before", count);

            // if (decision.maxVotes >= count) {
            //   return res.end();
            // }

            if (vote === "plus") {
              if (upVotesArray.some(x => x === userName)) {
                upVotesArray.splice(upVotesArray.indexOf(userName), 1);
              } else {
                upVotesArray.push(userName);
                downVotesArray.splice(downVotesArray.indexOf(userName), 1);
              }
            }
            if (vote === "minus") {
              if (downVotesArray.some(x => x === userName)) {
                downVotesArray.splice(downVotesArray.indexOf(userName), 1);
              } else {
                downVotesArray.push(userName);
                upVotesArray.splice(upVotesArray.indexOf(userName), 1);
              }
            }

            console.log("decision.answers after", decision.answers);

            decision.save().then(
              decision => {
                // console.log("decision.answers in save", decision.answers);
                res.json(decision.answers);
              },
              err => {
                console.log("error", err);
              }
            );
          },
          error => {
            res.status(STATUS_NOT_FOUND).json({
              message: error
            });
          }
        );
      }
    }
  );

  // set max votes
  app.put(
    "/api/set-maxVote/:decisionCode",
    passport.authenticate("jwt", { session: false }),
    function(req, res) {
      const decisionCode = req.params.decisionCode;
      const plusOrMinus = req.body.plusOrMinus;
      const userName = req.user.username;

      if (plusOrMinus === "minus") {
        maxVotes--;
      } else {
        maxVotes++;
      }
      console.log("maxVote", maxVotes);

      Decision.findOne({ decisionCode }).then(decision => {
        console.log("decision.maxVotes before", decision.maxVotes);
        if (decision.decisionCreatorUsername === userName) {
          Decision.updateOne({ decisionCode }, { $set: { maxVotes: maxVotes } })
            .then(decision => {
              Decision.findOne({ decisionCode }).then(decision => {
                console.log("decision", decision);
                res.status(STATUS_OKAY).json(decision.maxVotes);
              });
            })
            .catch(error => {
              console.log("error", error);
              res.status(STATUS_SERVER_ERROR).json({ message: "Server Error" });
            });
        } else {
          res.status(STATUS_NOT_FOUND).json({ message: "No decision found" });
        }
      });
    }
  );

  // set max votes
  app.put("/api/set-maxVote/:decisionCode", function(req, res) {
    console.log("req.body", req.body);
    res.send({ message: req.body.maxVotes });
  });

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
