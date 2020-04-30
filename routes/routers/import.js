const createError = require('http-errors');
const express = require('express');
const Models = require('../../models');
const passport = require('../../plugins/passport');

const auth = passport.authenticate('jwt', { session: false });
const canUser = require('../../middlewares/permission');

const { calculateImportAmount } = require('../../workers/common');
const { record } = require('../../workers/call');
const { filter, response } = require('./helpers');

module.exports = (model = 'import') => {
  const router = express.Router();

  router.route('/')
    .all(auth)
    .post(canUser('createAny', model), async (req, res, next) => {
      try {
        req.body.amount = calculateImportAmount(req.body) || 0;

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
    .delete(canUser('deleteAny', model), async (req, res, next) => {
      try {
        const { id } = req.params;

        const doc = await Models[model].findByIdAndRemove(id);
        if (!doc) throw createError(404, `Can't found ${model} with id: ${id}`);

        const { permission } = res.locals;

        const [err] = await record(req, { status: 200 });
        if (err) throw err;

        res.json(response[200](undefined, filter(permission, doc)));
      } catch (error) {
        next(error);
      }
    });

  return router;
};
