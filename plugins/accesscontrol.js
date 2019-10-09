const AccessControl = require('accesscontrol');

let grantsObject = {
  admin: {
    brand: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*']
    },
    category: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*']
    },
    image: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*']
    },
    import_detail: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*']
    },
    import: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*']
    },
    order_detail: {
      'create:any': ['*'],
      'read:any': ['*', '!user.password'],
      'update:any': ['*'],
      'delete:any': ['*']
    },
    order: {
      'create:any': ['*'],
      'read:any': ['*', '!user.password'],
      'update:any': ['*'],
      'delete:any': ['*']
    },
    payment: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*']
    },
    product_unit: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*']
    },
    product: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*']
    },
    shipment: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*']
    },
    staff: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*']
    },
    stock: {
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
    unit: {
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
    },
    call: {
      'create:any': ['*'],
      'read:any': ['*', '!caller.password'],
      'update:any': ['*'],
      'delete:any': ['*']
    },
    recycle: {
      'create:any': ['*'],
      'read:any': ['*', '!caller.password'],
      'update:any': ['*'],
      'delete:any': ['*']
    },
  },
  user: {
    user: {
      'create:own': ['*', '!password', '!role'],
      'read:own': ['*', '!password', '!role'],
      'update:own': ['*', '!password', '!role'],
      'delete:own': ['*', '!password', '!role']
    }
  }
};

module.exports = new AccessControl(grantsObject);
