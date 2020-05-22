const express = require('express');
const Models = require(('../../models'));

const { response, queryParser } = require('./helpers');

module.exports = (model = 'brand') => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const { filters, select, options } = queryParser.parse(req.query);

      const docs = await Models[model].find(filters, select, options);

      res.json(response[200](undefined, docs));
    } catch (error) {
      next(error);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;

      const doc = await Models[model].findById(id);

      res.json(response[200](undefined, doc));
    } catch (error) {
      next(error);
    }
  });

  return router;
};
