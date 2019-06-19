const express = require('express');
const Models = require('../../models')

module.exports = (model) => {
  const router = express.Router();

  router.route('/')
    .get((req, res, next) => {
      Models[model].find((err, docs) => {
        if(err) next(err);
        res.json(docs);
      });
    })
    .post((req, res, next) => {
      Models[model].create(req.body, (err, result) => {
        if(err) next(err);
        res.json(result);
      })
    })

  router.route('/:id')
    .get((req, res, next) => {
      Models[model].findById(req.params.id, (err, doc) => {
        if(err) next(err);
        res.json(doc);
      })
    })
    .put((req, res, next) => {
      Models[model].findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, doc) => {
        if(err) next(err);
        res.json(doc);
      })
    })
    .delete((req, res, next) => {
      Models[model].findByIdAndRemove(req.params.id, (err, doc) => {
        res.json(doc);
      })
    })

    return router;
}
