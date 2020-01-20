const express = require('express');
const passport = require('../../plugins/passport');
const Models = require('../../models');
const { response } = require('./helpers');
const { generateToken, decodeToken } = require('../../plugins/jwt');

module.exports = (model = 'user') => {
  const router = express.Router();

  router.get('/auth', async (req, res, next) => {
    try {
      const { token } = req.query;
      if (!token) return res.status(400).json(response[400]("Invalid token!", token));

      const { _id } = decodeToken(token, 'user_oauth');
      const user = await Models[model].findById(_id);
      if (!user) return res.status(404).json(response[404](undefined, user));

      return res.json(response[200](undefined, user));
    } catch (err) {
      next(err);
    }
  });

  router.get('/auth/facebook', passport.authenticate('facebook'));

  router.get('/auth/facebook/callback', (req, res, next) => {
    passport.authenticate('facebook', (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(400).json(response[400](info.message));

      const token = generateToken({ _id: user._id }, 'user_oauth');

      return res.redirect(`${process.env.APP_HOST}/api/users/auth?token=${token}`);
    })(req, res, next);
  });

  router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  router.get('/auth/google/callback', (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(400).json(response[400](info.message));

      const token = generateToken({ _id: user._id }, 'user_oauth');

      return res.redirect(`${process.env.APP_HOST}/api/users/auth?token=${token}`);
    })(req, res, next);
  });

  return router;
};
