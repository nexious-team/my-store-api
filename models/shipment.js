const validators = require('./helpers/validators');

module.exports = {
  _order: {
    type: 'ObjectId',
    ref: 'Order',
    required: true,
  },
  phone_number: {
    type: 'String',
    required: true,
    validate: validators.phone_number,
  },
  address: {
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
