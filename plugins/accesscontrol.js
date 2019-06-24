const AccessControl = require('accesscontrol');

let grantsObject = {
  admin: {
    category: {
      'create:any': ['*'],
      'read:any': ['*', '!info'],
      'update:any': ['*'],
      'delete:any': ['*']
    },
    product: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*']
    },
    supplier: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*']
    },
    user: {
      'create:any': ['*', '!password'],
      'read:any': ['*', '!password'],
      'update:any': ['*', '!password', '!email'],
      'delete:any': ['*', '!password']
    }
  },
  user: {
    user: {
      'create:own': ['*', '!password'],
      'read:own': ['*', '!password'],
      'update:own': ['*', '!password'],
      'delete:own': ['*', '!password']
    }
  }
};

module.exports = new AccessControl(grantsObject);
