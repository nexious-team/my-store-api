const express = require('express');
const Models = require('../../models')

module.exports = (model) => {
  const router = express.Router();

  router.route('/')
    .get((req, res, next) => {
      Models[model].find(common(res, next));
    })
    .post((req, res, next) => {
      Models[model].create(req.body, common(res, next))
    })

  router.route('/:id')
    .get((req, res, next) => {
      Models[model].findById(req.params.id, common(res, next))
    })
    .put((req, res, next) => {
      Models[model].findByIdAndUpdate(req.params.id, req.body, {new: true}, common(res, next))
    })
    .delete((req, res, next) => {
      Models[model].findByIdAndRemove(req.params.id, common(res, next))
    })

    return router;
}

// ============================= Functions
const common = (res, next) => (err, result) => {
  if(err) return next(err);
  res.json(doc);
}
