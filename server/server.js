const bodyParser = require("body-parser");
const express = require("express");
const server = express();
const mongoose = require("mongoose");
const User = require("./db/UserModel.js");
const Decision = require("./db/DecisionModel.js");
const cors = require("cors");
const Billing = require("./db/BillingModel.js");

const jwt = require("jwt-simple");
const passport = require("passport");
const config = require("./config/passport.js");

const STATUS_USER_ERROR = 422;
const STATUS_SERVER_ERROR = 500;
const STATUS_OKAY = 200;
const STATUS_NOT_FOUND = 404;

server.use(cors());
server.use(bodyParser.json());

server.use(passport.initialize());
// pass passport for configuration
require("./config/passport")(passport);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
const payments = require("./Payments.js");
payments(server);

server.get("/", function(req, res) {
  res.status(200).json({ message: "API running" });
});

mongoose.Promise = global.Promise;
const connect = mongoose.connect(
  "mongodb://localhost/test"
  // "mongodb://sneha.thadani:decisionjam@ds163769.mlab.com:63769/decisionjam"
);

connect.then(
  () => {
    const port = 8000;
    server.listen(port);
    console.log(`Server Listening on ${port}`);
  },
  err => {
    console.log("could not connect to MongoDB");
  }
);
