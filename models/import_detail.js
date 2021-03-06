module.exports = {
  _import: {
    type: 'ObjectId',
    required: true,
    ref: 'Import',
  },
  _product: {
    type: 'ObjectId',
    required: true,
    ref: 'Product',
  },
  _product_unit: {
    type: 'ObjectId',
    required: true,
    ref: 'ProductUnit',
  },
  quantity: {
    type: 'Number',
    required: true,
    min: 0,
  },
  price: {
    type: 'Number',
    required: true,
    min: 0,
  },
  amount: {
    type: 'Number',
    required: true,
    min: 0,
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
