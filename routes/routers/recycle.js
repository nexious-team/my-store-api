const express = require('express');
const Models = require('../../models');
const passport = require('../../plugins/passport');
const auth = passport.authenticate('jwt', { session: false });
const canUser = require('../../middlewares/permission');

const { record } = require('../../workers/call')
const { sentry } = require('../../workers/recycle')

const { filter, response } = require('./helpers')

module.exports = (model = 'recycle') => {
  const router = express.Router();
  const middlewares = [auth, canUser('createAny', model)];

  router.post('/restore/:id', middlewares, (req, res, next) => {
    Models[model].findById(req.params.id, (err, trash) => {
      if (err) return next(err);
      if (!trash) return next(new Error("Not Found"));
      const { permission } = res.locals;

      sentry.restore(trash, doc => {
        const message = `Restore trash ${doc.id} successfully`;
        res.json(response[200](message, filter(permission, doc)));
        record(req, { status: 200, message});
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
      const { permission } = res.locals;

      sentry.restore(trash, doc => {
        const message = `Restore ${trash.model} with id ${trash._id} successfully`;
        res.json(response[200](message, filter(permission, doc)));
        record(req, { status: 200, message });
      });
    })
  })

  return router;
}
