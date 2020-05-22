module.exports = {
  _supplier: {
    type: 'ObjectId',
    ref: 'Supplier',
    required: true,
  },
  amount: {
    type: 'Number',
    required: false,
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
