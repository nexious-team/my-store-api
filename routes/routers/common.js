const express = require('express');
const Models = require('../../models');
const passport = require('../../plugins/passport');

const auth = passport.authenticate('jwt', { session: false });
const canUser = require('../../middlewares/permission');

const { common } = require('./helpers');

module.exports = (model) => {
  const router = express.Router();

  router.route('/')
    .all(auth)
    .get(canUser('readAny', model), (req, res, next) => {
      Models[model].find().lean().exec(common(res, next));
    })
    .post(canUser('createAny', model), (req, res, next) => {
      Models[model].create(req.body, common(res, next))
    })

  router.route('/:id')
    .all(auth)
    .get(canUser('readAny', model), (req, res, next) => {
      Models[model].findById(req.params.id, common(res, next))
    })
    .put(canUser('updateAny', model), (req, res, next) => {
      Models[model].findByIdAndUpdate(req.params.id, req.body, { new: true }, common(res, next))
    })
    .delete(canUser('deleteAny', model), (req, res, next) => {
      Models[model].findByIdAndRemove(req.params.id, common(res, next))
    })

    return router;
}
