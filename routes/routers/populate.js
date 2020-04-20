const express = require('express');
const Models = require('../../models');
const passport = require('../../plugins/passport');

const auth = passport.authenticate('jwt', { session: false });
const canUser = require('../../middlewares/permission');

const { common } = require('./helpers');

module.exports = (model, { references }) => {
  const authenticate = (action) => [auth, canUser(action, model)];

  const router = express.Router();

  router.get('/populates?', authenticate('read'), (req, res, next) => {
    let query = Models[model].find();
    if (Array.isArray(references) && references.length > 0) {
      references.forEach((ref) => { query = query.populate(ref); });
    }

    query.exec(common(req, res, next));
  });

  router.get('/populates?/:reference', authenticate('read'), (req, res, next) => {
    Models[model].find().populate(req.params.reference).exec(common(req, res, next));
  });

  router.get('/:id/populates?', authenticate('read'), (req, res, next) => {
    let query = Models[model].findById(req.params.id);
    if (references && references.length > 0) {
      references.forEach((ref) => { query = query.populate(ref); });
    }

    query.exec(common(req, res, next));
  });

  router.get('/:id/populates?/:reference', authenticate('read'), (req, res, next) => {
    const { id, reference } = req.params;
    Models[model].findById(id).populate(reference).exec(common(req, res, next));
  });

  return router;
};
