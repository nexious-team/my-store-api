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
module.exports = new AccessControl();

(async () => {
  const docs = await Permission.find().lean();

  ac.setGrants(docs[0] ? docs : grantObject);
  ac.lock();
})();
