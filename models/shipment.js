module.exports = {
  _order: {
    type: 'ObjectId',
    ref: 'Order',
    required: true
  },
  phone: {
    type: 'String',
    required: true
  },
  address: {
    type: 'String',
    required: true 
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