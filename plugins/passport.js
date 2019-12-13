const passport = require('passport')
  , { Strategy: LocalStrategy } = require('passport-local')
  , { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt')
  , FacebookStrategy = require('passport-facebook').Strategy
  , GoogleStrategy = require('passport-google-oauth20').Strategy;

const { 
  user_oauth: UserOauth,
  user: User, 
  staff: Staff, 
  role: Role,
 } = require('../models');
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

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL
},
async function(accessToken, refreshToken, profile, done) {
  const doc = await UserOauth.findOneOrCreate(profile);
  const obj = normalize(doc);
  const user = await User.findOneOrCreate(obj);

  done(null, user);
}
));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
async function(token, tokenSecret, profile, done) {
  const doc = await UserOauth.findOneOrCreate(profile);
  const obj = normalize(doc);
  const user = await User.findOneOrCreate(obj);
  
  done(null, user);
}
));

const normalize = (oauth) => {
  const _oauth = oauth._id;
  const [first_name, last_name] = oauth.displayName.split(' ');
  const email = oauth.emails.length ? oauth.emails[0].value : null;
  const username = (first_name + last_name).toLowerCase();

  return {
    _oauth,
    first_name, 
    last_name,
    email,
    username,
    verified: true,
  }
}

module.exports = passport;
