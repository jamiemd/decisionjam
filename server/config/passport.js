const JwtStrategy = require("passport-jwt").Strategy;
ExtractJwt = require("passport-jwt").ExtractJwt;

const User = require("../db/UserModel");

module.exports = function(passport) {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");

  opts.JWT_ALLOW_REFRESH = true;
  opts.expiresIn = "15m";
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
