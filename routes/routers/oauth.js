const createError = require('http-errors');
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
      if (!token) return res.status(400).json(response[400]('Invalid token!', token));

      const { _id } = decodeToken(token, 'user_oauth');
      const user = await Models[model].findById(_id);
      if (!user) return next(createError(404, 'User: not found'));

      return res.json(response[200](undefined, user));
    } catch (err) {
      return next(err);
    }
  });

  router.get('/auth/facebook', passport.authenticate('facebook'));

  router.get('/auth/facebook/callback', (req, res, next) => {
    passport.authenticate('facebook', (err, user, info) => {
      if (err) return next(err);
      if (!user) return next(createError(400, info.message));

      const token = generateToken({ _id: user._id }, 'user_oauth');

      return res.redirect(`${process.env.APP_HOST}/api/users/auth?token=${token}`);
    })(req, res, next);
  });

  router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  router.get('/auth/google/callback', (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
      if (err) return next(err);
      if (!user) return next(createError(400, info.message));

      const token = generateToken({ _id: user._id }, 'user_oauth');

      return res.redirect(`${process.env.APP_HOST}/api/users/auth?token=${token}`);
    })(req, res, next);
  });

  return router;
};
