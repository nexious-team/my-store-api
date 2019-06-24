const ac = require('../plugins/accesscontrol');

module.exports = (action, resource) => {
  return ( req, res, next ) => {
    if ( req.user ) {
      const level = req.user.role === 'admin' ? 'Any' : 'Own';

      const permission = ac.can(req.user.role)[action + level](resource);

      if(!permission.granted) return res.status(403).send("Forbidden");

      // res.locals.filter = permission.filter;
      res.locals.permission = permission;
      next();
    } else {
      res.status(403).end();
    }
  }
}
