const express = require('express');
const Models = require(('../../models'));
const passport = require('../../plugins/passport');
const { record } = require('../../workers/call');
const upload = require('../../plugins/multer');

const auth = passport.authenticate('jwt', { session: false });
const canUser = require('../../middlewares/permission');

module.exports = (model) => {
  const router = express.Router();

  const middlewares = [auth, canUser('createAny', model), upload.single('image')];
  router.post('/upload', middlewares, async (req, res, next) => {
    try {
      const filename = req.file.originalname;
      const url = `${req.protocol}://${req.headers.host}/images/${req.file.filename}`;
      const image = await Models[model].create({ url, filename });

      res.json(image);

      record(req, { status: 200 });
    } catch (err) {
      next(err);
    }
  });

  return router;
};
