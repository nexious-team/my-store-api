const createError = require('http-errors');
const express = require('express');
const Models = require('../../models');
const passport = require('../../plugins/passport');

const auth = passport.authenticate('jwt', { session: false });
const canUser = require('../../middlewares/permission');

const { checkStockAndCalculateAmount } = require('../../workers/common');
const {
  isOrderPaid,
  calculateOrderTotalAmount,
} = require('../../workers/order');
const { decreaseProductStock,
  increaseProductStock,
} = require('../../workers/stock');
const { updatePaymentAmount } = require('../../workers/payment');
const { calculateAndUpdatePaymentAmount } = require('../../workers/order_detail');
const { record } = require('../../workers/call');
const { filter, response, lean } = require('./helpers');

module.exports = (model = 'order_detail') => {
  const router = express.Router();

  async function createDoc(body) {
    try {
      const { _order, _product, _product_unit: _productUnit } = body;

      const product = await Models.product.findById(_product);
      if (!product) throw createError(404, `Not found: product of ${_product}`);

      const productUnit = await Models.product_unit.findById(_productUnit);
      if (!productUnit) throw createError(404, `Not found: product_unit of ${_productUnit}`);

      const [err1, isPaid, , payment] = await isOrderPaid({ _id: _order });
      if (err1) throw err1;

      if (isPaid) {
        throw createError(400, 'Order is paid!');
      }
      let err2;
      [err2, body.price, body.amount] = await checkStockAndCalculateAmount(body);
      if (err2) throw err2;

      const doc = await Models[model].create(body);

      if (payment) {
        const [err3, amount] = await calculateOrderTotalAmount({ _id: doc._order });
        if (err3) throw err3;

        const [err4] = await updatePaymentAmount({ _id: payment._id, amount });
        if (err4) throw err4;
      }

      const [err5] = await decreaseProductStock(doc);
      if (err5) throw err5;

      return [null, doc];
    } catch (err) {
      return [err];
    }
  }

  router.route('/')
    .all(auth)
    .post(canUser('create', model), async (req, res, next) => {
      try {
        const { permission } = res.locals;
        const isMany = Array.isArray(req.body);
        if (isMany) {
          const docs = [];
          const errs = [];
          for (const obj of req.body) {
            // eslint-disable-next-line no-await-in-loop
            const [err, doc] = await createDoc(obj);
            if (err) errs.push(err.message || err);
            else docs.push(doc);
          }
          const [err2] = await record(req, { status: 200 });
          if (err2) throw err2;

          res.json(response[200](undefined, filter(permission, docs), errs));
        } else {
          const [err, doc] = await createDoc(req.body);
          if (err) throw err;

          const [err2] = await record(req, { status: 200 });
          if (err2) throw err2;

          res.json(response[200](undefined, filter(permission, doc)));
        }
      } catch (error) {
        next(error);
      }
    });

  router.route('/:id')
    .all(auth)
    .put(canUser('update', model), async (req, res, next) => {
      try {
        const { permission } = res.locals;
        const body = permission.filter(req.body);
        if (body._product_unit) throw createError(400, 'Cannot update _product_unit. Please create new one.');

        const doc = await Models[model].findById(req.params.id);
        if (!doc) {
          throw createError(404, 'Document not founded!');
        } else {
          const [err1, isPaid, , payment] = await isOrderPaid({ _id: doc._order });
          if (err1) throw err1;

          if (isPaid) {
            throw createError(400, 'Cannot update order which is paid!');
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

            const [err4] = await record(req, { status: 200 });
            if (err4) throw err4;

            res.json(response[200](undefined, filter(permission, updatedDoc)));
          }
        }
      } catch (error) {
        next(error);
      }
    })
    .delete(canUser('delete', model), async (req, res, next) => {
      try {
        const doc = await Models[model].findByIdAndRemove(req.params.id);
        if (!doc) throw createError(404, `Not found ${model} of ${req.params.id}`);

        const [err1, isPaid, , payment] = await isOrderPaid({ _id: doc._order });
        if (err1) throw err1;

        if (isPaid) {
          throw createError(400, 'Cannot update order which is paid!');
        }
        if (payment) {
          const [err2] = await calculateAndUpdatePaymentAmount({ _order: doc._order, _payment: payment._id });
          if (err2) throw err2;
        }
        const { permission } = res.locals;

        const [err3] = await increaseProductStock(doc);
        if (err3) throw err3;

        const [err4] = await record(req, { status: 200 });
        if (err4) throw err4;

        res.json(response[200](undefined, filter(permission, doc)));
      } catch (error) {
        next(error);
      }
    });

  return router;
};
