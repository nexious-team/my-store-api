const express = require('express');
const Models = require('../../models');
const passport = require('../../plugins/passport');

const auth = passport.authenticate('jwt', { session: false });
const canUser = require('../../middlewares/permission');

const { calculateImportAmount } = require('../../workers/common');
const { decreaseProductQty, increaseProductQty } = require('../../workers/order');
const { record } = require('../../workers/call');
const { filter, response } = require('./helpers');

module.exports = (model = 'import') => {
  const router = express.Router();

  router.route('/')
    .all(auth)
    .post(canUser('createAny', model), (req, res, next) => {
      req.body.amount = calculateImportAmount(req.body);

      Models[model].create(req.body, (err, doc) => {
        if (err) return next(err);
        const { permission } = res.locals;

        res.json(response[200](undefined, filter(permission, doc)));

        increaseProductQty(doc.product, doc.qty, console.log);
        record(req, { status: 200 });
      })
    })

  router.route('/:id')
    .all(auth)
    .delete(canUser('deleteAny', model), (req, res, next) => {
      Models[model].findByIdAndRemove(req.params.id, (err, doc) => {
        if (err) return next(err);
        if(!doc) return res.status(404).json(response[404](undefined, doc));

        const { permission } = res.locals;

        res.json(response[200]( undefined, filter(permission, doc)));

        decreaseProductQty(doc.product, doc.qty, console.log);
        record(req, { status: 200 });
      });
    })
  return router;
}
