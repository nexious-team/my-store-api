const ac = require('../plugins/accesscontrol');

module.exports = (action, resource) => (req, res, next) => {
  if (req.user) {
    let permission = ac.can(req.user.role)[`${action}Any`](resource);
    if (!permission.granted) {
      permission = ac.can(req.user.role)[`${action}Own`](resource);
    }
    if (!permission.granted) {
      return res.status(403).send('Forbidden');
    }

    res.locals.permission = permission;
    return next();
  }

  return res.status(403).end();
};
