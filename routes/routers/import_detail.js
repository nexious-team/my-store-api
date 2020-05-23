const createError = require('http-errors');
const express = require('express');
const Models = require('../../models');
const passport = require('../../plugins/passport');

const { increaseProductStock, decreaseProductStock } = require('../../workers/stock');
const { record } = require('../../workers/call');
const { filter, response } = require('./helpers');

const auth = passport.authenticate('jwt', { session: false });
const canUser = require('../../middlewares/permission');

module.exports = (model = 'import_detail') => {
  const router = express.Router();

  async function createDoc(body) {
    try {
      const { _import, _product, _product_unit: _productUnit } = body;

      const importDoc = await Models.import.findById(_import);
      if (!importDoc) throw createError(404, `Not found: import of ${_import}`);
      const product = await Models.product.findById(_product);
      if (!product) throw createError(404, `Not found: product of ${_product}`);
      const productUnit = await Models.product_unit.findById(_productUnit);
      if (!productUnit) throw createError(404, `Not found: product_unit of ${_productUnit}`);

      const doc = await Models[model].create(body);

      const [err] = await increaseProductStock(doc);
      if (err) throw err;

      return [null, doc];
    } catch (err) {
      return [err];
    }
  }
  router.route('/')
    .all(auth)
    .post(canUser('create', model), async (req, res, next) => {
      try {
        const { permission } = res.locals;
        const isMany = Array.isArray(req.body);
        if (isMany) {
          const docs = [];
          const errs = [];
          for (const obj of req.body) {
            // eslint-disable-next-line no-await-in-loop
            const [err, doc] = await createDoc(obj);
            if (err) errs.push(err);
            else docs.push(doc);
          }
          const [recordErr] = await record(req, { status: 200 });
          if (recordErr) throw recordErr;

          res.json(response[200](undefined, filter(permission, docs), errs));
        } else {
          const [err, doc] = await createDoc(req.body);
          if (err) throw err;

          const [recordErr] = await record(req, { status: 200 });
          if (recordErr) throw recordErr;

          res.json(response[200](undefined, filter(permission, doc)));
        }
      } catch (error) {
        next(error);
      }
    });

  router.route('/:id')
    .all(auth)
    .delete(canUser('delete', model), async (req, res, next) => {
      try {
        const { id } = req.params;
        const doc = await Models[model].findById(id);
        if (!doc) throw createError(404, `Can't found ${model} with id: ${id}`);

        const trash = await doc.remove();

        const [err] = await decreaseProductStock(trash);
        if (err) throw err;

        const [recordErr] = await record(req, { status: 200 });
        if (recordErr) throw recordErr;

        const { permission } = res.locals;

        res.json(response[200](undefined, filter(permission, trash)));
      } catch (error) {
        next(error);
      }
    });

  return router;
};
