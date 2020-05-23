const express = require('express');
const createError = require('http-errors');
const { Types: { ObjectId } } = require('mongoose');
const Models = require('../../models');
const passport = require('../../plugins/passport');

const auth = passport.authenticate('jwt', { session: false });
const canUser = require('../../middlewares/permission');

const { record } = require('../../workers/call');
const { filter, response, queryParser, isNotNullObjectHasProperties } = require('./helpers');

const lookups = [
  {
    $lookup: {
      from: 'orderdetails',
      localField: '_id',
      foreignField: '_order',
      as: 'order_details',
    },
  },
  {
    $lookup: {
      from: 'payments',
      localField: '_id',
      foreignField: '_order',
      as: 'payment',
    },
  },
  {
    $unwind: {
      path: '$payment',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: 'shipments',
      localField: '_id',
      foreignField: '_order',
      as: 'shipment',
    },
  },
  {
    $unwind: {
      path: '$shipment',
      preserveNullAndEmptyArrays: true,
    },
  },
];

module.exports = (model = 'order') => {
  const router = express.Router();

  router.route('/')
    .all(auth)
    .get(
      canUser('read', model),
      async (req, res, next) => {
        try {
          const { filters, select, options } = queryParser.parse(req.query);
          const { skip, limit, sort } = options;

          if (filters._id) {
            if (filters._id.$in) {
              filters._id.$in = filters._id.$in.map((id) => ObjectId(id));
            } else {
              filters._id = ObjectId(filters._id);
            }
          }

          const pipeline = [
            ...lookups,
            { $match: filters },
            { $skip: skip },
            { $limit: limit },
          ];

          if (isNotNullObjectHasProperties(select)) {
            for (const key in select) {
              select[key] = parseInt(select[key], 10);
            }
            pipeline.push({ $project: select });
          }
          if (isNotNullObjectHasProperties(sort)) {
            for (const key in sort) {
              sort[key] = parseInt(sort[key], 10);
            }
            pipeline.push({ $sort: sort });
          }

          res.locals.pipeline = pipeline;
          next();
        } catch (error) {
          next(error);
        }
      },
      async (req, res, next) => {
        try {
          if (req.user.role !== 'user') next();
          else {
            res.locals.pipeline.unshift({ $match: { _user: req.user._identity._id } });
            next();
          }
        } catch (error) {
          next(error);
        }
      },
      async (req, res, next) => {
        try {
          const { pipeline, permission } = res.locals;
          const docs = await Models[model].aggregate(pipeline);

          res.json(response[200](undefined, filter(permission, docs)));
        } catch (error) {
          next(error);
        }
      },
    )
    .post(canUser('create', model), async (req, res, next) => {
      try {
        req.body._user = req.user._identity._id;

        const doc = await Models[model].create(req.body);
        const { permission } = res.locals;

        const [err] = await record(req, { status: 200 });
        if (err) throw err;

        res.json(response[200](undefined, filter(permission, doc)));
      } catch (error) {
        next(error);
      }
    });

  router.route('/:id')
    .all(auth)
    .get(
      canUser('read', model),
      async (req, res, next) => {
        try {
          const order = await Models[model].findById(req.params.id);
          if (!order) throw createError(404, `Not found: ${model} of id ${req.params.id}`);
          const pipeline = [...lookups];
          if (req.user.role === 'user') {
            pipeline.unshift({ $match: { _id: order._id, _user: req.user._identity._id } });
          }
          res.locals.pipeline = pipeline;
          next();
        } catch (error) {
          next(error);
        }
      },
      async (req, res, next) => {
        try {
          if (req.headers.admin) next();
          else {
            const { pipeline } = res.locals;
            const docs = await Models[model].aggregate(pipeline);

            res.json(response[200](undefined, docs[0]));
          }
        } catch (err) {
          next(err);
        }
      },
    );

  router.route('/:id/order-details')
    .all(auth)
    .get(canUser('read', 'order_detail'), async (req, res, next) => {
      try {
        const docs = await Models.order_detail.find({ _order: req.params.id }).populate('_product');
        const { permission } = res.locals;

        const [err] = await record(req, { status: 200 });
        if (err) throw err;

        res.json(response[200](undefined, filter(permission, docs)));
      } catch (error) {
        next(error);
      }
    });

  return router;
};
