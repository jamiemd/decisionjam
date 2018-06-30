module.export = app => {
  app.post(
    "/api/decision/create",
    passport.authenticate("jwt", { session: false }),
    function(req, res) {
      const newDecision = new Decision(req.body);
      // console.log("req.body", req.body);
      let decisionCode = "feck";
      // console.log(decisionCode);
      let decisionCodeDupe = true;

      //while (decisionCodeDupe) {  // i need to get this working so that it loops
      //keeps generating a code until there is no match on the database. while
      // while loops don't work with async findOne callback/promises as the while loop
      // will always keep running and get priority over the async code but there must be
      // a common solution for this as the general pattern i'm trying to cover is very common
      // just have to match it into node async way of doing things
      //getUser(Math.random().toString(36).substr(2, 5));
      console.log("in loop");
      //decisionCodeNotUnique = true;
      console.log(decisionCodeDupe);
      //}
      Decision.findOne(
        {
          decisonCode: (decisionCode = Math.random()
            .toString(36)
            .substr(2, 5))
        },
        function(err, result) {
          if (err) {
            console.log("in err");
            res
              .status(STATUS_USER_ERROR)
              .json({ error: "Error while adding", err });
          }
          if (result) {
            console.log("result", result);
            console.log(
              "got a duplicate code server should be setup to generate another code"
            );
          } else {
            console.log("code must be unique");
            console.log(decisionCodeDupe);
            decisionCodeDupe = false;
            console.log(decisionCodeDupe);
          }
        }
      );

      //}

      newDecision.decisionCode = decisionCode;
      // console.log("newDecision", newDecision);

      // newDecision.decisionCreatorId = req.user.username;
      newDecision.decisionCreatorId = req.user._id;

      // console.log("decision make is" + newDecision.decisionCreatorId);
      console.log("decisionCode", decisionCode);
      //check the user contains all required data

      newDecision.save((err, decision) => {
        // console.log("decision", decision);
        if (err) {
          console.log("err", err);
          res.status(STATUS_USER_ERROR).json({ error: "Error while adding" });
        } else {
          // console.log("decision in else", decision);
          res.status(STATUS_OKAY).json({ decision: decision });
        }
      });
    }
  );

  app.get(
    "/api/decision/:id",
    passport.authenticate("jwt", { session: false }),
    function(req, res) {
      const id = req.params.id;
      const userId = req.user.username;
      Decision.findOne({ decisionCode: id }).then(
        decision => {
          // console.log("decision in id", decision);

          res.status(STATUS_OKAY).json({
            ...decision.toObject(),
            votesByUser: userVotes(decision, userId),
            username: req.user.username
          });
        },
        err =>
          res
            .status(STATUS_NOT_FOUND)
            .json({ error: "Decision with id " + id + " not found" })
      );
    }
  );

  // postman test example localhost:8000/api/decision/decisionCode/k65gy
  // server.get(
  //   "/api/decision/decisionCode/:decisionCode",
  //   passport.authenticate("jwt", { session: false }),
  //   function(req, res) {
  //     const currentLoddgedInUserId = req.user
  //       ? req.user._id
  //       : "5b01aeb1abaade1eacdc67ce";
  //     const decisionCode = req.params.decisionCode;
  //     console.log("decisionCode", decisionCode);
  //     Decision.find({ decisionCode: decisionCode }).then(
  //       decision => {
  //         decision = Object.assign({ currentLoddgedInUserId }, decision);
  //         return res.status(STATUS_OKAY).json(decision);
  //       }, //{decision = Object.assign({currentLoddgedInUserId},decision);return
  //       err =>
  //         res
  //           .status(STATUS_NOT_FOUND)
  //           .json({ error: "Decision with code " + decisionCode + " not found" })
  //     );
  //   }
  // );

  app.get(
    "/api/decision/decisionCode/:decisionCode",
    passport.authenticate("jwt", { session: false }),
    function(req, res) {
      const currentLoggedInUserId = req.user
        ? req.user._id
        : "5b01aeb1abaade1eacdc67ce";
      const decisionCode = req.params.decisionCode;
      // console.log("decisonCode is " + decisionCode);
      // console.log("currentLoggedInUserId Pat", currentLoggedInUserId);
      //  Decision.find({ decisionCode: decisionCode }).then(
      //   //decision => {decision = Object.assign({decision},{currentLoggedInUserId});return res.status(STATUS_OKAY).json(decision)}, //{decision = Object.assign({currentLoddgedInUserId},decision);return
      //   decision =>  res.status(STATUS_OKAY).json({decision),
      //   err =>
      //     res
      //       .status(STATUS_NOT_FOUND)
      //       .json({ error: "Decision with code " + decisionCode + " not found" })
      // );

      // Decision.findOne({ decisionCode }).then(
      //   decision => {
      //     console.log("decision", decision);
      //     Decision.updateOne(
      //       { decision },
      //       { $set: { currentLoggedInUserId } }
      //     ).then(
      //       result => {
      //         console.log("result", result);
      //         res.status(STATUS_OKAY).json(decision);
      //       },
      //       err => {
      //         console.log("err", err);
      //         res.status(STATUS_NOT_FOUND).json({
      //           error: "Decision with id " + id + " not updated" + " " + err
      //         });
      //       }
      //     );
      //   },
      //   err =>
      //     res
      //       .status(STATUS_NOT_FOUND)
      //       .json({ error: "Decision with id " + id + " not found" })
      // );

      Decision.updateOne(
        { decisionCode },
        { $set: { currentLoggedInUserId } }
      ).then(
        result => {
          console.log("result", result);
          Decision.findOne({ decisionCode }).then(decision => {
            console.log("decision", decision);
            res.status(STATUS_OKAY).json(decision);
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
        // console.log(
        //   "decision.decisionCreatorId",
        //   typeof decision.decisionCreatorId
        // );
        // console.log("req.user", typeof req.user._id);
        // console.log(
        //   "decision.decisionCreatorId === req.user._id",
        //   decision.decisionCreatorId === String(req.user._id)
        // );
        // if (decision.decisionCreatorId === req.user.username) {
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
