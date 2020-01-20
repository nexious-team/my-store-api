const express = require('express');
const Models = require('../../models');
const passport = require('../../plugins/passport');

const auth = passport.authenticate('jwt', { session: false });
const canUser = require('../../middlewares/permission');

const { response } = require('./helpers');

module.exports = (model) => {
  const router = express.Router();

  router.get('/count', auth, canUser('readAny', model), async (req, res) => {
    try {
      const number = await Models[model].count();

      res.json(response[200](undefined, number));
    } catch (err) {
      next(err);
    }
  });

  router.get('/schema', auth, canUser('readAny', model), (req, res) => {
    const schema = Models[model].schema.obj;

    res.json(response[200](undefined, schema));
  });
  return router;
};
