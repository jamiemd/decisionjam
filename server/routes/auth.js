const jwt = require("jwt-simple");
const passport = require("passport");
const User = require("../db/UserModel");
const Billing = require("../db/BillingModel.js");

const STATUS_USER_ERROR = 422;
const STATUS_SERVER_ERROR = 500;
const STATUS_OKAY = 200;
const STATUS_NOT_FOUND = 404;

module.exports = app => {
  // signup
  app.post("/api/signup", function(req, res) {
    const newUser = new User(req.body);
    if (!newUser.username || !newUser.password || !newUser.email) {
      res.status(400).json({ error: "Missing required information" });
      return;
    }
    newUser.save((err, user) => {
      if (err) {
        if (err.name === "BulkWriteError") {
          res
            .status(STATUS_USER_ERROR)
            .json({ error: "Username already exists.", err });
        } else if (err.name === "ValidationError") {
          res.status(STATUS_USER_ERROR).json({
            error: "Password must be at least 8 characters.",
            err
          });
        } else {
          res
            .status(STATUS_USER_ERROR)
            .json({ error: "Error while adding", err });
        }
      } else {
        res.status(STATUS_OKAY).json(user);
      }
    });
  });

  // login
  app.post("/api/login", function(req, res) {
    if (!req.body.username || !req.body.password) {
      res.status(400).json({ error: "Missing required information" });
      return;
    }
    User.findOne(
      {
        $or: [{ email: req.body.email }, { username: req.body.username }]
      },
      function(err, user) {
        console.log("err:", err);
        if (err) throw err;
        if (!user) {
          res.json({
            success: false,
            msg: "Authentication failed. User not found."
          });
        } else {
          // check if password matches
          console.log(user.password, req.body.password);
          user.comparePassword(req.body.password, function(err, isMatch) {
            console.log(isMatch);
            if (isMatch && !err) {
              // if user is found and password is right create a token
              var token = jwt.encode(user, "cs5Rocks");
              // return the information including token as JSON
              Billing.findOne({ username: req.body.username })
                .sort({ subscriptionID: -1 })
                .then((subscription, err) => {
                  // console.log('subscription', subscription, 'err', err);
                  if (!subscription) {
                    res.json({
                      success: true,
                      token: "JWT " + token,
                      subscriptionID: false,
                      user: req.body.username
                    });
                  } else {
                    res.json({
                      success: true,
                      token: "JWT " + token,
                      subscriptionID: subscription.subscriptionID,
                      user: req.body.username
                    });
                  }
                });
            } else {
              res.json({
                success: false,
                msg:
                  "Authentication failed. Username or password is incorrect. ",
                err
              });
            }
          });
        }
      }
    );
  });

  // logout
  app.get(
    "/api/logout",
    passport.authenticate("jwt", { session: false }),
    function(req, res) {
      console.log("Logged Out");
      req.logout();
      res.status(200).redirect("/");
    }
  );

  // authenticate
  app.get(
    "/api/authenticate",
    passport.authenticate("jwt", { session: false }),
    function(req, res) {
      res.json({
        message: "Success! You can not see this without a token",
        user: req.user
      });
    }
  );
};
