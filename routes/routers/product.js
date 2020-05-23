const express = require('express');
const { Types: { ObjectId } } = require('mongoose');
const createError = require('http-errors');

const Models = require('../../models');
const { response, queryParser, isNotNullObjectHasProperties } = require('./helpers');

const lookups = [
  {
    $lookup: {
      from: 'brands',
      localField: '_brand',
      foreignField: '_id',
      as: 'brand',
    },
  },
  {
    $unwind: {
      path: '$brand',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: 'categories',
      localField: '_categories',
      foreignField: '_id',
      as: 'categories',
    },
  },
  {
    $lookup: {
      from: 'files',
      localField: '_images',
      foreignField: '_id',
      as: 'images',
    },
  },
  {
    $lookup: {
      from: 'stocks',
      localField: '_id',
      foreignField: '_product',
      as: 'stock',
    },
  },
  { $unwind: '$stock' },
  {
    $lookup: {
      from: 'productunits',
      localField: '_id',
      foreignField: '_product',
      as: 'product_units',
    },
  },
];

module.exports = (model = 'product') => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      if (req.headers.admin) {
        next();
      } else {
        const { filters, select, options } = queryParser.parse(req.query);
        const { skip, limit, sort } = options;

        for (const key of ['_id', '_brand', '_categories']) {
          if (filters[key]) {
            if (filters[key].$in) {
              filters[key].$in = filters[key].$in.map((id) => ObjectId(id));
            } else {
              filters[key] = ObjectId(filters[key]);
            }
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
        const docs = await Models[model].aggregate(pipeline);

        res.json(response[200](undefined, docs));
      }
    } catch (err) {
      next(err);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      if (req.headers.admin) next();
      else {
        const product = await Models[model].findById(req.params.id);
        if (!product) throw createError(404, `Not found ${model} of ${req.params.id}`);
        else {
          const docs = await Models[model].aggregate([
            { $match: { _id: product._id } },
            ...lookups,
          ]);

          res.json(response[200](undefined, docs[0]));
        }
      }
    } catch (err) {
      next(err);
    }
  });

  return router;
};
