const express = require('express');
const Models = require('../../models');
const passport = require('../../plugins/passport');
const mongoose = require('mongoose')
const auth = passport.authenticate('jwt', { session: false });
const canUser = require('../../middlewares/permission');

const { record } = require('../../workers/call')
const { sentry } = require('../../workers/recycle')

module.exports = (model = 'recycle') => {
  const router = express.Router();
  const middlewares = [auth, canUser('createAny', model)];

  router.post('/restore/:id', middlewares, (req, res, next) => {
    Models[model].findById(req.params.id, (err, trash) => {
      if (err) return next(err);
      if (!trash) return next(new Error("Not Found"));

      sentry.restore(trash, doc => {
        const response = { message: `Restore trash ${doc.id} successfully`}
        res.json(response);
        record(req, { status: 200, ...response});
      })
    })
  })

  router.post('/restore/:model/:id', middlewares, (req, res, next) => {
    Models[model].findOne({
      model: req.params.model,
      'document._id': req.params.id,
    }, (err, trash) => {
      if (err) return next(err);
      if (!trash) return next(new Error("Not Found"));

      sentry.restore(trash, doc => {
        const response = { message: `Restore ${trash.model} with id ${trash._id} successfully`}
        res.json(response);
        record(req, { status: 200, ...response});
      });
    })
  })

  return router;
}
