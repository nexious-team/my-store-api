const express = require('express');
const Models = require('../../models');
const passport = require('../../plugins/passport');
const { generateToken } = require('../../plugins/jwt');
const canUser = require('../../middlewares/permission');
const { common, lean, exclude, copy } = require('./helpers');
const userWorker = require('../../workers/user');

const auth = passport.authenticate('jwt', { session: false });

module.exports = (model) => {
  const router = express.Router();

  router.post('/signup', async (req, res, next) => {
    Models[model].create(req.body, (err, user) => {
      if(err) return next(err);
      const profile = exclude(user, ['password', 'role']);
      userWorker.createRole(user._id, user.role, model);
      if(user) res.json({ message: "Sign up successfully" , profile});
    })
  })

  router.post('/login', (req, res, next) => {
    passport.authenticate(model, function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.status(400).json(info); }
      
      req.login(user, { session: false }, function(err) {
        if (err) { return next(err); }
        Models['role'].findOne({ _identity: user._id }, (err, role) => {
          const token = generateToken(role._id, 'user');
          const profile = exclude(user, ['password', 'role']);
          return res.json({message: "Login successfully", token, profile});
        })
      });
    })(req, res, next);
  })

  router.route('/profile')
    .all(auth)
    .get(canUser('readOwn','user'), async (req, res, next) => {
      const doc = await Models[model].findById(req.user._identity._id);
      if (!doc) return res.status(404).json({ error: "Not found!"});

      const profile = res.locals.permission.filter(lean(doc));
      res.json(profile);
    })
    .put(canUser('updateOwn', 'user'), async (req, res, next) => {
      const user = await Models[model].findById(req.user._identity._id);
      if (!user) return res.status(404).json({ error: "Not found!"})

      copy(req.body, user);
      const profile = await user.save();
      const data = res.locals.permission.filter(lean(profile));
      res.json(data);
    })

  router.route('/calls?')
    .all(auth)
    .get(canUser('readOwn', 'call'), (req, res, next) => {
      Models['call'].find({_caller: req.user._id}, common(req, res, next));
    })

  return router;
}
