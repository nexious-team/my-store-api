module.exports.definition = {
  name: {
    first: String,
    last: String,
    display: String
  },
  dob: Date,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  address: {
    street: String,
    village: String,
    district: String,
    province: String
  },
  info: String
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
