const express = require('express');
const Models = require('../../models');
const passport = require('../../plugins/passport');
const { generateToken, decodeToken } = require('../../plugins/jwt');
const canUser = require('../../middlewares/permission');
const { common, logger, filter, response } = require('./helpers');
const userWorker = require('../../workers/user');
const ac = require('../../plugins//accesscontrol');
const mailer = require('../../plugins/nodemailer');

const auth = passport.authenticate('jwt', { session: false });

module.exports = (model) => {
  const router = express.Router();

  router.post('/signup', async (req, res, next) => {
    Models[model].create(req.body, (err, user) => {
      if (err) {
        logger.log('error', `POST '${req.originalUrl}' \n => Error Said: ${err}`);
        next(err);
      } else {
        const token = generateToken({ _id: user._id }, 'verify_email');
        mailer.send('verify_email', { token, model }).catch(console.log);

        userWorker.createRole(user._id, user.role, model);

        const message = 'Signup succeed!';

        const permission = ac.can(user.role).readOwn(model);
        if (!permission.granted) {
          res.json(response[200](message, true));
        } else {
          res.json(response[200](message, filter(permission, user)));
        }
      }
    });
  });

  router.get('/verify-email', async (req, res, next) => {
    const { token } = req.query;
    if (!token) {
      next();
    } else {
      const { _id } = decodeToken(token, 'verify_email');
      const user = await Models[model].findById(_id);
      if (!user) {
        next();
      } else {
        user.verified = true;
        await user.save();
        res.json(response[200]('User verified!'));
      }
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
                res.status(404).json(response[404]('Role not found'));
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
    .get(canUser('readOwn', model), async (req, res) => {
      const doc = await Models[model].findById(req.user._identity._id);
      if (!doc) {
        res.status(404).json({ error: 'Not found!' });
      } else {
        const { permission } = res.locals;

        res.json(response[200](undefined, filter(permission, doc)));
      }
    })
    .put(canUser('updateOwn', model), async (req, res) => {
      const user = await Models[model].findById(req.user._identity._id);
      if (!user) {
        res.status(404).json({ error: 'Not found!' });
      } else {
        const { permission } = res.locals;

        user.set(permission.filter(req.body));
        const profile = await user.save();
        res.json(response[200](undefined, filter(permission, profile)));
      }
    });

  router.route('/calls?')
    .all(auth)
    .get(canUser('readOwn', 'call'), (req, res, next) => {
      Models.call.find({ _caller: req.user._id }, common(req, res, next));
    });

  router.route('/reset-password')
    .post(async (req, res) => {
      const { email } = req.body;

      const user = await Models[model].findOne({ email });
      if (!user) {
        res.json(response[404]('Email haven\'t registered!'));
      } else {
        const token = generateToken({ _id: user._id }, 'reset_password');

        mailer.send('reset_password', { token, model });

        res.json(response[200]('Reset email sent!'));
      }
    })
    .put(async (req, res) => {
      const token = req.headers['x-store'];
      const { password } = req.body;
      if (!token) {
        res.json(response[404]('Token not found!'));
      } else {
        const { _id } = decodeToken(token, 'reset_password');
        const user = await Models[model].findById(_id);
        if (!user) res.json(response[400]('Invalid token!'));

        user.password = password;
        await user.save();

        res.json(response[200]('Password updated!'));
      }
    });

  return router;
};
