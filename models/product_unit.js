module.exports = {
  _product: {
    type: 'ObjectId',
    required: true,
    ref: 'Product',
  },
  name: {
    type: 'String',
    required: true,
  },
  quantity: {
    type: 'Number',
    required: true,
    min: 0,
  },
  max_order: {
    type: 'Number',
    required: true,
    min: 0,
  },
  price: {
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
