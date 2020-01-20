const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const {
  user_oauth: UserOauth,
  user: User,
  staff: Staff,
  role: Role,
} = require('../models');
const { keys } = require('./jwt');

passport.use('user', new LocalStrategy(
  {
    usernameField: 'email',
  },
  ((email, password, done) => {
    User.findOne({ email }, (err, user) => {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      if (!user.compare(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }),
));
passport.use('staff', new LocalStrategy(
  {
    usernameField: 'email',
  },
  ((email, password, done) => {
    Staff.findOne({ email }, (err, user) => {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      if (!user.compare(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }),
));
const options = {
  jwtFromRequest: ExtractJwt.fromHeader('x-store'),
  secretOrKey: keys.user.secret,
};

passport.use('jwt', new JwtStrategy(options, ((decoded, done) => {
  Role.findById(decoded._id)
    .populate('_identity')
    .exec((err, role) => {
      if (err) return done(err, false);
      if (!role) return done(null, false);

      return done(null, role);
    });
})));

const normalize = (oauth) => {
  const _oauth = oauth._id;
  const [firstName, lastName] = oauth.displayName.split(' ');
  const email = oauth.emails.length ? oauth.emails[0].value : null;
  const username = (firstName + lastName).toLowerCase();

  return {
    _oauth,
    first_name: firstName,
    last_name: lastName,
    email,
    username,
    verified: true,
  };
};


passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
},
(async (_accessToken, _refreshToken, profile, done) => {
  const doc = await UserOauth.findOneOrCreate(profile);
  const obj = normalize(doc);
  const user = await User.findOneOrCreate(obj);

  done(null, user);
})));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
},
(async (_token, _tokenSecret, profile, done) => {
  const doc = await UserOauth.findOneOrCreate(profile);
  const obj = normalize(doc);
  const user = await User.findOneOrCreate(obj);

  done(null, user);
})));

module.exports = passport;
