const express = require('express');
const Models = require('../../models');
const passport = require('../../plugins/passport');

const auth = passport.authenticate('jwt', { session: false });
const canUser = require('../../middlewares/permission');

const { record } = require('../../workers/call');
const { filter, response } = require('./helpers');

module.exports = (model = 'order') => {
  const router = express.Router();

  router.route('/')
    .all(auth)
    .post(canUser('create', model), async (req, res, next) => {
      try {
        req.body._user = req.user._identity._id;

        Models[model].create(req.body, (err, doc) => {
          if (err) {
            next(err);
          } else {
            const { permission } = res.locals;

            res.json(response[200](undefined, filter(permission, doc)));

            record(req, { status: 200 });
          }
        });
      } catch (e) {
        next(e);
      }
    });

  router.route('/:id/order-details')
    .all(auth)
    .get(canUser('read', 'order_detail'), async (req, res, next) => {
      try {
        const docs = await Models.order_detail.find({ _order: req.params.id }).populate('_product');
        const { permission } = res.locals;

        res.json(response[200](undefined, filter(permission, docs)));
        record(req, { status: 200 });
      } catch (err) {
        next(err);
      }
    });

  return router;
};
