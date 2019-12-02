module.exports = {
  _caller: {
    type: 'ObjectId',
    refPath: 'caller_ref',
  },
  caller_ref: {
    type: 'String',
    default: 'User',
  },
  model: {
    type: 'String',
    required: true,
  },
  document: {
    type: 'Object',
    required: true,
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
