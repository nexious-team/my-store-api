module.exports = {
  _product: {
    type: 'ObjectId',
    ref: 'Product',
    unique: true
  },
  _product_unit: {
    type: 'ObjectId',
    ref: 'ProductUnit'
  },
  quantity: {
    type: 'Number',
    required: true,
    min: 0
  },
  info: 'String',
  create_date: {
    type: 'Date',
    default: new Date(),
  },
  update_date: {
    type: 'Date'
  },

}