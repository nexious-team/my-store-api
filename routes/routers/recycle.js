const express = require('express');
const Models = require('../../models');
const passport = require('../../plugins/passport');

const auth = passport.authenticate('jwt', { session: false });
const canUser = require('../../middlewares/permission');

const { record } = require('../../workers/call');
const { sentry } = require('../../workers/recycle');

const { filter, response } = require('./helpers');

module.exports = (model = 'recycle') => {
  const router = express.Router();
  const middlewares = [auth, canUser('create', model)];

  router.post('/restore/:id', middlewares, async (req, res, next) => {
    try {
      const trash = await Models[model].findById(req.params.id);
      if (!trash) throw new Error('Not Found');
      const { permission } = res.locals;

      sentry.restore(trash, async (doc) => {
        const message = `Restore trash ${doc.id} successfully`;
        const [err] = await record(req, { status: 200, message });
        if (err) throw err;

        res.json(response[200](message, filter(permission, doc)));
      });
    } catch (error) {
      next(error);
    }
  });

  router.post('/restore/:model/:id', middlewares, async (req, res, next) => {
    try {
      const body = {
        model: req.params.model,
        'document._id': req.params.id,
      };
      const trash = await Models[model].findOne(body);
      if (!trash) {
        throw new Error('Not Found');
      } else {
        const { permission } = res.locals;

        sentry.restore(trash, async (doc) => {
          const message = `Restore ${trash.model} with id ${trash._id} successfully`;
          const [err] = await record(req, { status: 200, message });
          if (err) throw err;

          res.json(response[200](message, filter(permission, doc)));
        });
      }
    } catch (error) {
      next(error);
    }
  });

  return router;
};
