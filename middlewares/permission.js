const ac = require('../plugins/accesscontrol');

module.exports = (action, resource) => {
  return ( req, res, next ) => {
    if ( req.user ) {
      const permission = ac.can(req.user.role)[action](resource);
      if(!permission.granted) return res.status(403).send("Forbidden");

      res.locals.permission = permission;
      next();
    } else {
      res.status(403).end();
    }
  }
}
