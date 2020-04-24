const express = require('express');

const Models = require('../../models');
const canUser = require('../../middlewares/permission');

const passport = require('../../plugins/passport');
const { createPayment } = require('../../plugins/stripe');

const { calculateOrderTotalAmount } = require('../../workers/order');
const { checkPaymentStatus } = require('../../workers/payment');
const { record } = require('../../workers/call');
const { sentry } = require('../../workers/recycle');

const { filter, response } = require('./helpers');

const auth = passport.authenticate('jwt', { session: false });

module.exports = (model = 'payment') => {
  const router = express.Router();

  router.route('/')
    .all(auth)
    .post(canUser('create', model), async (req, res, next) => {
      try {
        const order = await Models.order.findById(req.body._order);
        if (!order) {
          return res.status(404).json(response[404](undefined, order));
        }
        const [err1, amount] = await calculateOrderTotalAmount({ _id: order._id });
        if (err1) throw err1;

        const paymentIntent = await createPayment({ amount });

        const doc = await Models[model].create({ ...req.body, amount, _stripe: paymentIntent.id });
        const { permission } = res.locals;

        order._payment = doc._id;
        await order.save();

        const [err2] = await record(req, { status: 200 });
        if (err2) throw err2;

        const payload = { ...filter(permission, doc), client_secret: paymentIntent.client_secret };

        res.json(response[200](undefined, payload));
        return null;
      } catch (err) {
        return next(err);
      }
    });

  router.route('/:id')
    .all(auth)
    .get(canUser('read', model), async (req, res, next) => {
      try {
        const [match, doc, paymentIntent] = await checkPaymentStatus({ _id: req.params.id });
        if (match) {
          next();
        } else {
          doc.status = paymentIntent.status;
          await doc.save();
          next();
        }
      } catch (err) {
        next(err);
      }
    })
    .put(canUser('update', model), async (req, res, next) => {
      try {
        if (req.body.status) {
          const [match] = await checkPaymentStatus({ _id: req.params.id });
          if (match) {
            next();
          } else {
            res.status(400).json(response[400]('The status doesn\'t match what on stripe server'));
          }
        } else {
          next();
        }
      } catch (err) {
        next(err);
      }
    })
    .delete(canUser('delete', model), async (req, res, next) => {
      try {
        const doc = await Models[model].findById(req.params.id);
        if (!doc) return res.status(404).json(response[404]('Payment not found!'));
        if (doc.status === 'succeeded') {
          return res.status(400).json(response[400]('Cannot delete payment which was paid'));
        }
        const trash = await doc.remove();
        sentry.collect(req, trash);

        await Models.order.findByIdAndUpdate(trash._order, { $unset: { _payment: 1 } });
        const { permission } = res.locals;

        const [err] = await record(req, { status: 200 });
        if (err) throw err;

        return res.json(response[200](undefined, filter(permission, trash)));
      } catch (error) {
        return next(error);
      }
    });

  return router;
};
