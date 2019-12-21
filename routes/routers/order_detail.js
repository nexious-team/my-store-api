const express = require('express');
const Models = require('../../models');
const passport = require('../../plugins/passport');

const auth = passport.authenticate('jwt', { session: false });
const canUser = require('../../middlewares/permission');

const { checkStockAndCalculateAmount } = require('../../workers/common');
const { decreaseProductStock, increaseProductStock } = require('../../workers/order');
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
        
        res.json(response[200](undefined, filter(permission, doc)));

      } catch (e) {
        next(e);
      }
    })
  
  router.route('/:id')
    .all(auth)
    .delete(canUser('deleteAny', model), async (req, res, next) => {
      try {
        const doc = await Models[model].findByIdAndRemove(req.params.id);
        if(!doc) return res.status(404).json(response[404](undefined, doc));

        const { permission } = res.locals;

        res.json(response[200](undefined, filter(permission, doc)));

        await increaseProductStock(doc);
        record(req, { status: 200 });
      } catch (e) {
        next(e);
      }
    })

  return router;
}
