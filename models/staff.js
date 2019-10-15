module.exports.definition = {
  role: {
    type: String,
    required: true,
    default: 'staff',
    enum: ['staff', 'admin']
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

module.exports.middlewares = (schema) => {
  schema.pre('save', function (next) {
    this.password = this.hash(this.password);
    next();
  })
}

const { hash, compare } = require('./helpers/password');

module.exports.methods = (schema) => {
  schema.methods.hash = hash;

  schema.methods.compare = compare;
}