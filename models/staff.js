module.exports = {
  role: {
    type: String,
    required: true 
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  birth_date: {
    type: Date,
    required: true
  },
  contact: {
    type:  [String],
    default: undefined
  },
  address: {
    type: String,
  },
  info: String,
	create_date: {
		type: Date,
		default: new Date(),
	},
	update_date: {
		type: Date
	},

}
