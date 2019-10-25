const express = require('express');
const Models = require('../../models');
const passport = require('../../plugins/passport');

const auth = passport.authenticate('jwt', { session: false });
const canUser = require('../../middlewares/permission');

const { checkStockAndCalculateAmount } = require('../../workers/common');
const { decreaseProductStock, increaseProductQty } = require('../../workers/order');
const { record } = require('../../workers/call');
const { filter, response } = require('./helpers');

module.exports = (model = 'order_detail') => {
  const router = express.Router();

  router.route('/')
    .all(auth)
    .post(canUser('createAny', model), async (req, res, next) => {
      try {
        
        [req.body.price, req.body.amount] = await checkStockAndCalculateAmount(req.body);

        const doc = await Models[model].create(req.body);
        const { permission } = res.locals;

        await decreaseProductStock(doc);
        record(req, { status: 200 });
        
        res.json(response[200](null, filter(permission, doc)));

      } catch (e) {
        next(e);
      }
    })

  return router;
}
