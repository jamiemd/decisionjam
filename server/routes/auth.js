const jwt = require("jwt-simple");

module.exports = app => {
  app.get(
    "/api/users",
    passport.authenticate("jwt", { session: false }),
    function(req, res) {
      User.find({}, (err, users) => {
        if (err) {
          res
            .status(STATUS_USER_ERROR)
            .json({ error: "Could not find the user." });
        } else {
          res.status(STATUS_OKAY).json(users);
        }
      });
    }
  );

  app.post("/api/users/adduser", function(req, res) {
    const newUser = new User(req.body);
    //check the user contains all required data
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

  //gotta convert ugly callback code to beautiful promises
  //http://erikaybar.name/using-es6-promises-with-mongoosejs-queries/
  // route to authenticate a user (POST http://localhost:8080/api/login)
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

  /* Handle Logout */

  //see last comment https://stackoverflow.com/questions/45541182/passport-req-logout-function-not-working
  app.get(
    "/api/logout",
    passport.authenticate("jwt", { session: false }),
    function(req, res) {
      console.log("I am Logout");
      req.logout();
      res.status(200).redirect("/");
    }
  );

  //how to setup routes that need auth as well as test it on postman
  //https://jonathanmh.com/express-passport-json-web-token-jwt-authentication-beginners/
  app.get(
    "/api/routeThatNeedsJWTToken",
    passport.authenticate("jwt", { session: false }),
    function(req, res) {
      res.json({
        "Success! You can not see this without a token": "bla",
        user: req.user
      });
    }
  );
};
