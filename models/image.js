const validators = require('./helpers/validators');

module.exports = {
  _owner: {
    type: 'ObjectId',
    required: false,
    refPath: 'owner_ref',
  },
  owner_ref: {
    type: 'String',
    enum: ['User', 'Staff', 'Brand', 'Product', 'Supplier'],
    default: 'Product',
  },
  url: {
    type: 'String',
    required: true,
    // validate: validators.url,
  },
  filename: {
    type: 'String',
    required: true,
  },
  info: 'String',
  create_date: {
    type: 'Date',
    default: new Date(),
  },
  update_date: {
    type: 'Date',
  },
};
