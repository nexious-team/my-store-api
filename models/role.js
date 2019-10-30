module.exports = {
  _identity: {
    type: 'String',
    refPath: 'refModel'
  },
  refModel: {
    type: 'String',
    default: 'User',
    enum: ['User', 'Staff']
  },
  role: {
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