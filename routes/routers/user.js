const express = require('express');
const createError = require('http-errors');

const Models = require('../../models');
const canUser = require('../../middlewares/permission');
const passport = require('../../plugins/passport');
const ac = require('../../plugins/accesscontrol');
const { upload } = require('../../plugins/multer');
const mailer = require('../../plugins/nodemailer');
const { generateToken, decodeToken } = require('../../plugins/jwt');
const { record } = require('../../workers/call');
const worker = require('../../workers/user');
const { common, logger, filter, response } = require('./helpers');

const auth = passport.authenticate('jwt', { session: false });

module.exports = (model) => {
  const router = express.Router();

  router.post('/signup', async (req, res, next) => {
    try {
      const user = await Models[model].create(req.body);

      const token = generateToken({ _id: user._id }, 'verify_email');
      mailer.send('verify_email', { token, model }).catch(console.log);

      worker.createRole(user._id, user.role, model);

      const message = 'Signup succeed! Please verify the email to activate your account.';

      const permission = ac.can(user.role).readOwn(model);
      if (!permission.granted) {
        res.json(response[200](message, true));
      } else {
        res.json(response[200](message, filter(permission, user)));
      }
    } catch (err) {
      logger.log('error', `POST '${req.originalUrl}' \n => Error Said: ${err}`);
      next(err);
    }
  });

  router.get('/verify-email', async (req, res, next) => {
    try {
      const { token } = req.query;
      if (!token) throw createError(400, 'Invalid token!', token);

      const { _id } = decodeToken(token, 'verify_email');
      const user = await Models[model].findById(_id);
      if (!user) throw createError(404, 'Identity not found');

      user.verified = true;
      await user.save();

      res.json(response[200]('User verified!'));
    } catch (err) {
      next(err);
    }
  });

  router.post('/login', (req, res, next) => {
    passport.authenticate(model, (errAuth, user, info) => {
      if (errAuth) {
        next(errAuth);
      } else {
        req.login(user, { session: false }, (errLogin) => {
          if (errLogin) {
            next(errLogin);
          } else if (!user) {
            res.status(400).json(response[400](info.message));
          } else {
            Models.role.findOne({ _identity: user._id }, (err, role) => {
              if (err) {
                next(err);
              } else if (!role) {
                next(createError(404, 'Role not found'));
              } else {
                const token = generateToken({ _id: role._id, username: user.username }, 'user');

                res.json(response[200]('Login succeed!', { token }));
              }
            });
          }
        });
      }
    })(req, res, next);
  });

  router.route('/profile')
    .all(auth)
    .get(canUser('read', model), async (req, res, next) => {
      try {
        const user = await Models[model].findById(req.user._identity._id).populate('_avatar');
        if (!user) throw createError(404, 'Identity not found');

        const { permission } = res.locals;

        res.json(response[200](undefined, filter(permission, user)));
      } catch (err) {
        next(err);
      }
    })
    .put(canUser('update', model), async (req, res, next) => {
      try {
        const user = await Models[model].findById(req.user._identity._id);
        if (!user) throw createError(404, 'Identity not found');

        const { permission } = res.locals;

        user.set(permission.filter(req.body));
        const profile = await user.save();

        res.json(response[200](undefined, filter(permission, profile)));
      } catch (err) {
        next(err);
      }
    });

  const middlewares = [auth, canUser('update', model), upload.single('avatar')];
  router.route('/avatar')
    .post(middlewares, async (req, res, next) => {
      try {
        const path = `/images/${req.file.filename}`;
        const image = await Models.image.create({ path });

        const user = await Models[model].findById(req.user._identity._id);
        if (!user) throw createError(404, 'Identity not found');

        user._avatar = image._id;
        await user.save();

        const [err] = await record(req, { status: 200 });
        if (err) throw err;

        res.json(response[200]('Avatar uploaded!', image));
      } catch (err) {
        logger.error(err);
        next(err);
      }
    });

  router.route('/calls?')
    .all(auth)
    .get(canUser('read', 'call'), (req, res, next) => {
      Models.call.find({ _caller: req.user._id }, common(req, res, next));
    });

  router.route('/reset-password')
    .post(async (req, res, next) => {
      try {
        const { email } = req.body;

        const user = await Models[model].findOne({ email });
        if (!user) throw createError(404, 'The email haven\'t registered!');

        const token = generateToken({ _id: user._id }, 'reset_password');

        mailer.send('reset_password', { token, model });

        res.json(response[200]('Reset email sent!'));
      } catch (err) {
        next(err);
      }
    })
    .put(async (req, res, next) => {
      try {
        const token = req.headers['x-store'];
        const { password } = req.body;
        if (!token) throw createError(404, 'Token not found!');

        const { _id } = decodeToken(token, 'reset_password');
        const user = await Models[model].findById(_id);
        if (!user) throw createError(400, 'Invalid token!');

        user.password = password;
        await user.save();

        res.json(response[200]('Password updated!'));
      } catch (err) {
        next(err);
      }
    });

  return router;
};
