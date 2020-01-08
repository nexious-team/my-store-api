const AccessControl = require('accesscontrol');
const Permission = require('../models').permission;

const grantObject = {
  admin: {
    permission: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
  },
};

const ac = new AccessControl();

(async () => {
  const docs = await Permission.find().lean();

  ac.setGrants(docs.length ? docs : grantObject);
  ac.lock();
})();

module.exports = ac;
