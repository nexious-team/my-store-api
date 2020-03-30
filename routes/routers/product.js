const express = require('express');
const Models = require('../../models');
const { response } = require('./helpers');

module.exports = (model = 'product') => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      if (req.headers.admin) {
        next();
      } else {
        const { page, limit, sort, ...query } = req.query;
        const limitNumber = isNaN(limit) ? 25 : parseInt(limit, 10);
        const pageNumber = isNaN(page) || page === '0' ? 1 : parseInt(page, 10);
        const skip = (pageNumber - 1) * limitNumber;

        const pipeline = [
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
              from: 'images',
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
          { $match: query },
          { $skip: skip },
          { $limit: limitNumber },
        ];
        if (typeof sort === 'object' && sort !== null && Object.keys(sort).length > 0) {
          for (const key in sort) {
            sort[key] = parseInt(sort[key], 10);
          }
          pipeline.push({ $sort: sort });
        }
        const docs = await Models[model].aggregate(pipeline);

        res.json(response[200](undefined, docs));
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  });

  return router;
};
