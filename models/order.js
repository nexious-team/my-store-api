module.exports = {
  _user: {
    type: 'ObjectId',
    ref: 'User',
    required: true,
  },
  _shipment: {
    type: 'ObjectId',
    ref: 'Shipment',
  },
  _payment: {
    type: 'ObjectId',
    ref: 'Payment',
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
