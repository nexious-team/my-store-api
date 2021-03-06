const express = require('express');
const Models = require(('../../models'));
const passport = require('../../plugins/passport');
const { record } = require('../../workers/call');
const { upload, dataUri } = require('../../plugins/multer');
const cloud = require('../../plugins/cloudinary');

const auth = passport.authenticate('jwt', { session: false });
const canUser = require('../../middlewares/permission');

module.exports = (model) => {
  const router = express.Router();

  const middlewares = [auth, canUser('create', model), upload.single('file')];
  router.post('/upload', middlewares, async (req, res, next) => {
    try {
      // upload file to cloudinary
      const fileContent = dataUri(req).content;
      const { url } = await cloud.uploads(fileContent);

      const filename = req.file.originalname;
      const file = await Models[model].create({ url, filename });

      res.json(file);
      record(req, { status: 200 });
    } catch (err) {
      next(err);
    }
  });

  return router;
};
