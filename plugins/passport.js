const passport = require('passport')
  , { Strategy: LocalStrategy } = require('passport-local')
  , { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const { user: User } = require('../models');
const { keys } = require('./jwt');

passport.use(new LocalStrategy({
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
const options = {
  jwtFromRequest: ExtractJwt.fromHeader('x-store'),
  secretOrKey: keys.user.secret
}

passport.use( new JwtStrategy( options, function (decoded, done) {
  User.findById( decoded.id, function (err, user) {
    if (err) return done(err, false);
    if (!user) return done(null, false);

    return done(null, user);
   });
}))

module.exports = passport;
