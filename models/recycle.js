module.exports = {
  _caller: {
    type: 'ObjectId',
    refPath: 'callerRef',
  },
  callerRef: {
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
