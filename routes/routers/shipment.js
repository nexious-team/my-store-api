const express = require('express');
const createError = require('http-errors');

const Models = require('../../models');
const canUser = require('../../middlewares/permission');
const passport = require('../../plugins/passport');
const { filter, response } = require('./helpers');
const { record } = require('../../workers/call');

const auth = passport.authenticate('jwt', { session: false });

module.exports = (model = 'shipment') => {
  const router = express.Router();

  router.route('/')
    .all(auth)
    .post(canUser('create', model), async (req, res, next) => {
      try {
        const { _order } = req.body;
        const order = await Models.order.findById(_order);
        if (!order) throw createError(404, `Not found order of id ${_order}`);
        const doc = await Models[model].create(req.body);

        const [err] = await record(req, { status: 200 });
        if (err) throw err;

        const { permission } = res.locals;

        res.json(response[200](undefined, filter(permission, doc)));
      } catch (error) {
        next(error);
      }
    });

  router.route('/:id')
    .all(auth)
    .put(canUser('update', model), async (req, res, next) => {
      try {
        if (req.body._order) {
          const order = await Models.order.findById(req.body._order);
          if (!order) throw createError(404, `Not found order of id ${req.body._order}`);
          next();
        } else {
          next();
        }
      } catch (error) {
        next(error);
      }
    });

  return router;
};
