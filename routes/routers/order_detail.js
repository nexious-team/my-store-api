const express = require('express');
const Models = require('../../models');
const passport = require('../../plugins/passport');

const auth = passport.authenticate('jwt', { session: false });
const canUser = require('../../middlewares/permission');

const { calculateOrderAmount } = require('../../workers/common');
const { decreaseProductQty, increaseProductQty } = require('../../workers/order');
const { record } = require('../../workers/call');
const { filter, response } = require('./helpers');

module.exports = (model = 'order_detail') => {
  const router = express.Router();

  router.route('/')
    .all(auth)
    .post(canUser('createAny', model), async (req, res, next) => {
      try {
        console.log(req.body);
        
        [req.body.price, req.body.amount] = await calculateOrderAmount(req.body);

        res.json(req.body);
        // Models[model].create(req.body, (err, doc) => {
        //   if (err) return next(err);
        //   const { permission } = res.locals;

        //   res.json(response[200](null, filter(permission, doc)));

        //   decreaseProductQty(doc._product, doc.quantity, console.log);
        //   record(req, { status: 200 });
        // })
      } catch (e) {
        next(e);
      }
    })

  return router;
}
