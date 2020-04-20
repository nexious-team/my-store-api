module.exports = {
  _order: {
    type: 'ObjectId',
    ref: 'Order',
    required: true,
  },
  _stripe: {
    type: 'String',
    required: false,
  },
  amount: 'Number',
  status: {
    type: 'String',
    enum: [
      'requires_payment_method',
      'requires_confirmation',
      'requires_action',
      'processing',
      'succeeded',
      'canceled',
    ],
  },
  method: 'String',
  credential: 'Object',
  info: 'String',
  create_date: {
    type: 'Date',
    default: new Date(),
  },
  update_date: {
    type: 'Date',
  },
};
