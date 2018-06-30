//https://devdactic.com/restful-api-user-authentication-1/
// https://stackoverflow.com/questions/36533767/nodejs-jwtstrategy-requires-a-function-to-retrieve-jwt-from-requests-error
const JwtStrategy = require("passport-jwt").Strategy;
ExtractJwt = require("passport-jwt").ExtractJwt;

// load up the user model
const User = require("../db/UserModel");

module.exports = function(passport) {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");

  opts.JWT_ALLOW_REFRESH = true;
  opts.expiresIn = "15m"; // set session time to expire in 15 mins, not sure if it's working
  // i seem to be able to the token after 15 mins, lets see in live
  opts.secretOrKey = "cs5Rocks";
  passport.use(
    new JwtStrategy(opts, function(jwt_payload, done) {
      User.findOne({ _id: jwt_payload._id }, function(err, user) {
        if (err) {
          return done(err, false);
        }
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      });
    })
  );
};
