const express = require('express');
const Models = require('../../models');
const passport = require('../../plugins/passport');

const auth = passport.authenticate('jwt', { session: false });
const canUser = require('../../middlewares/permission');

const { calculateOrderAmount } = require('../../workers/common');
const { decreaseProductQty, increaseProductQty } = require('../../workers/order');
const { record } = require('../../workers/call');
const { filter, response } = require('./helpers');

module.exports = (model = 'order') => {
  const router = express.Router();

  router.route('/')
    .all(auth)
    .post(canUser('createAny', model), async (req, res, next) => {
      try {
        req.body.amount = await calculateOrderAmount(req.body);

        Models[model].create(req.body, (err, doc) => {
          if (err) return next(err);
          const { permission } = res.locals;

          res.json(response[200](null, filter(permission, doc)));

          decreaseProductQty(doc.product, doc.qty, console.log);
          record(req, { status: 200 });
        })
      } catch (e) {
        next(e);
      }
    })

  router.route('/:id')
    .all(auth)
    .delete(canUser('deleteAny', model), (req, res, next) => {
      try {
        Models[model].findByIdAndRemove(req.params.id, (err, doc) => {
          if (err) return next(err);
          const { permission } = res.locals;

          res.json(response[200](null, filter(permission, doc)));

          increaseProductQty(doc.product, doc.qty, console.log);
          record(req, { status: 200 });
        })
      } catch (e) {
        next(e);
      }
    })

  return router;
}
