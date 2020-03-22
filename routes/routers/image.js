const express = require('express');
const Models = require(('../../models'));
const passport = require('../../plugins/passport');
const { record } = require('../../workers/call');
const upload = require('../../plugins/multer');
const cloud = require('../../plugins/cloudinary');

const auth = passport.authenticate('jwt', { session: false });
const canUser = require('../../middlewares/permission');

module.exports = (model) => {
  const router = express.Router();

  const middlewares = [auth, canUser('createAny', model), upload.single('image')];
  router.post('/upload', middlewares, async (req, res, next) => {
    try {
      // POST IMAGE TO CLOUDINARY
      const { url } = await cloud.uploads(req.file.path);

      const filename = req.file.originalname;
      const image = await Models[model].create({ url, filename });

      res.json(image);
      record(req, { status: 200 });
    } catch (err) {
      next(err);
    }
  });

  return router;
};
