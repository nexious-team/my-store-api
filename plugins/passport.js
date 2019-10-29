const passport = require('passport')
  , { Strategy: LocalStrategy } = require('passport-local')
  , { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const { user: User, staff: Staff, role: Role } = require('../models');
const { keys } = require('./jwt');

passport.use('user', new LocalStrategy(
  {
    usernameField: 'email'
  },
  function (email, password, done) {
    User.findOne({ email }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      if (!user.compare(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
))
passport.use('staff', new LocalStrategy(
  {
    usernameField: 'email'
  },
  function (email, password, done) {
    Staff.findOne({ email }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      if (!user.compare(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
))
const options = {
  jwtFromRequest: ExtractJwt.fromHeader('x-store'),
  secretOrKey: keys.user.secret
}

passport.use('jwt', new JwtStrategy(options, function (decoded, done) {
  Role.findById(decoded._id)
    .populate('_identity')
    .exec(function (err, role) {
      if (err) return done(err, false);
      if (!role) return done(null, false);

      return done(null, role);
    });
}))

module.exports = passport;
