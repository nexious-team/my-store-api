module.exports = {
  _order: {
    type: 'ObjectId',
    required: true,
    ref: 'Order',
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
