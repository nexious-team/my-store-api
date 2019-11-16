module.exports.definition = {
  role: {
    type: 'String',
    enum: ['user'],
    default: 'user'
  },
  first_name: {
    type: 'String',
    required: true
  },
  last_name: {
    type: 'String',
    required: true
  },
  username: {
    type: 'String',
    required: true,
    unique: true,
  },
  email: {
    type: 'String',
    required: true,
    unique: true,
  },
  password: {
    type: 'String',
    required: true
  },
  verified: {
    type: 'Boolean',
    default: false
  },
  birth_date: 'Date',
  contact: {
    type:  ['String'],
    default: undefined
  },
  address: {
    type: 'String',
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

module.exports.middlewares = (schema) => {
  schema.pre('save', function (next) {
    if(this.isModified('password'))
      this.password = this.hash(this.password);
    next();
  })
}
const { hash, compare } = require('./helpers/password');

module.exports.methods = (schema) => {
  schema.methods.hash = hash;

  schema.methods.compare = compare;
}

module.exports.statics = (schema) => {
  schema.statics.findByEmail = function (email) {
    return this.find({email});
  }
}
