const express = require('express');
const { user: User } = require('../../models');
const passport = require('../../plugins/passport');
const { signUser } = require('../../plugins/jwt');

module.exports = () => {
  const router = express.Router();

  router.post('/signup', (req, res, next) => {
    User.create(req.body, (err, user) => {
      if(err) next(err);
      res.json(user);
    })
  })

  router.post('/login', (req, res, next) => {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.json(info); }
      req.login(user, { session: false }, function(err) {
        if (err) { return next(err); }
        const token = signUser(user.id);
        return res.json({user, token});
      });
    })(req, res, next);
  })

  router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    if(!req.user) return res.status(401).json("Unauthorized");
    res.json(req.user);
  })

  return router;
}
