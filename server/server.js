const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());

const auth = require("./routes/auth.js");
auth(app);
const decision = require("./routes/decision.js");
decision(app);
const payments = require("./routes/payments.js");
payments(app);

const passport = require("passport");
app.use(passport.initialize());
require("./config/passport")(passport);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

mongoose.Promise = global.Promise;
const connect = mongoose.connect("mongodb://localhost/decisionjam");

connect.then(
  () => {
    const port = 8000;
    app.listen(port);
    console.log(`Server Listening on ${port}`);
  },
  err => {
    console.log("could not connect to MongoDB", err);
  }
);
