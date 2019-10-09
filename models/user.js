module.exports.definition = {
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
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
    type: String
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  birth_date: Date,
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

const bcrypt = require('bcryptjs');

module.exports.middlewares = (schema) => {
  schema.pre('save', function (next) {
    this.password = this.hash(this.password);
    next();
  })
}

module.exports.methods = (schema) => {
  schema.methods.hash = function (password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }

  schema.methods.compare = function (password) {
    const match = bcrypt.compareSync(password, this.password);
    return match;
  }
}

module.exports.statics = (schema) => {
  schema.statics.findByEmail = function (email) {
    return this.find({email});
  }
}
