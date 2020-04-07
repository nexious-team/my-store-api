const express = require('express');
const Models = require('../../models');
const passport = require('../../plugins/passport');

const auth = passport.authenticate('jwt', { session: false });
const canUser = require('../../middlewares/permission');

const { checkStockAndCalculateAmount } = require('../../workers/common');
const { decreaseProductStock, increaseProductStock, isOrderPaid, calculateOrderTotalAmount } = require('../../workers/order');
const { updatePaymentAmount } = require('../../workers/payment');
const { calculateAndUpdatePaymentAmount } = require('../../workers/order_detail');
const { record } = require('../../workers/call');
const { filter, response, lean } = require('./helpers');

module.exports = (model = 'order_detail') => {
  const router = express.Router();

  router.route('/')
    .all(auth)
    .post(canUser('create', model), async (req, res, next) => {
      try {
        const [err1, isPaid, , payment] = await isOrderPaid({ _id: req.body._order });
        if (err1) throw err1;

        if (isPaid) {
          res.status(400).json(response[400]('Order is paid!'));
        } else {
          let err2;
          [err2, req.body.price, req.body.amount] = await checkStockAndCalculateAmount(req.body);
          if (err2) throw err2;

          const doc = await Models[model].create(req.body);
          const { permission } = res.locals;

          if (payment) {
            const [err3, amount] = await calculateOrderTotalAmount({ _id: doc._order });
            if (err3) throw err3;

            const [err4] = await updatePaymentAmount({ _id: payment._id, amount });
            if (err4) throw err4;
          }

          await decreaseProductStock(doc);
          record(req, { status: 200 });

          res.json(response[200](undefined, filter(permission, doc)));
        }
      } catch (e) {
        console.log(e);
        next(e);
      }
    });

  router.route('/:id')
    .all(auth)
    .put(canUser('update', model), async (req, res, next) => {
      try {
        const { permission } = res.locals;
        const body = permission.filter(req.body);
        if (body._product_unit) throw new Error('Cannot update _product_unit. Please create new one.');

        const doc = await Models[model].findById(req.params.id);
        if (!doc) {
          res.status(404).json(response[404]('Document not founded!'));
        } else {
          const [err1, isPaid, , payment] = await isOrderPaid({ _id: doc._order });
          if (err1) throw err1;

          if (isPaid) {
            res.status(400).json(response[400]('Cannot update order which is paid!'));
          } else {
            const updateFields = [];
            for (const prop in body) {
              if (body[prop] !== doc[prop]) updateFields.push(prop);
              else delete body[prop];
            }

            const sideEffectFields = ['quantity'];
            const isRequireUpdatePayment = updateFields.some((field) => sideEffectFields.includes(field));

            const arg = { ...lean(doc), ...body };
            let err2;
            [err2, body.price, body.amount] = await checkStockAndCalculateAmount(arg);
            if (err2) throw err2;

            if (body.quantity) {
              if (body.quantity > doc.quantity) {
                await decreaseProductStock({
                  _product: doc._product,
                  _product_unit: doc._product_unit,
                  quantity: body.quantity - doc.quantity,
                });
              }
              if (body.quantity < doc.quantity) {
                await increaseProductStock({
                  _product: doc._product,
                  _product_unit: doc._product_unit,
                  quantity: doc.quantity - body.quantity,
                });
              }
            }
            for (const prop in body) {
              doc[prop] = body[prop];
            }
            const updatedDoc = await doc.save();

            if (payment && isRequireUpdatePayment) {
              const [err3] = await calculateAndUpdatePaymentAmount({ _order: updatedDoc._order, _payment: payment._id });
              if (err3) throw err3;
            }

            record(req, { status: 200 });
            res.json(response[200](undefined, filter(permission, updatedDoc)));
          }
        }
      } catch (err) {
        next(err);
      }
    })
    .delete(canUser('delete', model), async (req, res, next) => {
      try {
        const doc = await Models[model].findByIdAndRemove(req.params.id);
        if (!doc) return res.status(404).json(response[404](undefined, doc));

        const [err1, isPaid, , payment] = await isOrderPaid({ _id: doc._order });
        if (err1) throw err1;

        if (isPaid) {
          res.status(400).json(response[400]('Cannot update order which is paid!'));
          return false;
        }
        if (payment) {
          const [err2] = await calculateAndUpdatePaymentAmount({ _order: doc._order, _payment: payment._id });
          if (err2) throw err2;
        }
        const { permission } = res.locals;

        await increaseProductStock(doc);
        record(req, { status: 200 });

        res.json(response[200](undefined, filter(permission, doc)));
        return true;
      } catch (e) {
        return next(e);
      }
    });

  return router;
};
