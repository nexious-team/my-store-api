const express = require('express');
const { user: User } = require('../../models');
const passport = require('../../plugins/passport');
const { signUser } = require('../../plugins/jwt');
const canUser = require('../../middlewares/permission');

module.exports = () => {
  const router = express.Router();

  router.post('/signup', (req, res, next) => {
    User.create(req.body, (err, user) => {
      if(err) next(err);
      const profile = exclude(user, ['password', 'role']);
      if(user) res.json({ message: "Sign up successfully" , profile});
    })
  })

  router.post('/login', (req, res, next) => {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.status(400).json(info); }
      req.login(user, { session: false }, function(err) {
        if (err) { return next(err); }
        const token = signUser(user._id);
        const profile = exclude(user, ['password', 'role']);
        return res.json({message: "Login successfully", token, profile});
      });
    })(req, res, next);
  })

  router.route('/profile')
    .all(passport.authenticate('jwt', { session: false }))
    .get(canUser('readOwn','user'), (req, res, next) => {
      if(!req.user) return res.status(401).json("Unauthorized");
      const profile = res.locals.permission.filter(lean(req.user));
      res.json(profile);
    })
    .put(canUser('updateOwn', 'user'), async (req, res, next) => {
      const user = req.user;
      copy(user, req.body);
      const profile = await user.save();
      const data = res.locals.permission.filter(lean(profile));
      res.json(data);
    })

  return router;
}
// ================== Functions
function lean(document) {
  return JSON.parse(JSON.stringify(document));
}

function exclude(document, fields) {

  const filtered = Object.keys(document.toObject())
    .filter(key => !fields.includes(key))
    .reduce((obj, key) => {
      obj[key] = document[key];
      return obj;
    }, {});

  return filtered;
}

function copy(target, source) {
  for(let key in source) {
    if( typeof target[key] === 'object') copy( target[key], source[key] );
    else target[key] = source[key];
    continue;
  }
}
