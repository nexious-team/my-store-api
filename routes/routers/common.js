const express = require('express');
const Models = require('../../models');
const passport = require('../../plugins/passport');

const auth = passport.authenticate('jwt', { session: false });
const canUser = require('../../middlewares/permission');

const { common, queryParser } = require('./helpers');

module.exports = (model) => {
  const router = express.Router();

  router.route('/')
    .all(auth)
    .get(canUser('read', model), (req, res, next) => {
      const { filters, select, options } = queryParser.parse(req.query);

      Models[model].find(filters, select, options).exec(common(req, res, next));
    })
    .post(canUser('create', model), (req, res, next) => {
      Models[model].create(req.body, common(req, res, next));
    });

  router.route('/:id')
    .all(auth)
    .get(canUser('read', model), (req, res, next) => {
      Models[model].findById(req.params.id, common(req, res, next));
    })
    .put(canUser('update', model), (req, res, next) => {
      Models[model].findByIdAndUpdate(req.params.id, req.body, { new: true }, common(req, res, next));
    })
    .delete(canUser('delete', model), (req, res, next) => {
      Models[model].findByIdAndRemove(req.params.id, common(req, res, next));
    });

  return router;
};
