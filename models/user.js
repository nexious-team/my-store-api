const { hash, compare } = require('./helpers/password');
const { findOneOrCreate } = require('./helpers/find');
const validators = require('./helpers/validators');

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
    required: false,
    unique: true,
  },
  email: {
    type: 'String',
    required: false,
    unique: true,
    validate: validators['email']
  },
  password: {
    type: 'String',
    required: false
  },
  verified: {
    type: 'Boolean',
    default: false
  },
  _oauth: {
    type: "ObjectId",
    ref: "UserOauth"
  },
  birth_date: 'Date',
  contact: [{
    type:  'String',
    default: undefined,
    validate: validators['phone_number']
  }],
  address: {
    type: 'String',
  },
  _avatar: {
    type: 'ObjectId',
    ref: 'Image'
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

module.exports.decorate = (schema) => {
  schema.index({ email: 1, _oauth: 1 }, { unique: true });

  schema.pre('save', function (next) {
    if(this.isModified('password'))
      this.password = this.hash(this.password);
    next();
  })

  schema.methods.hash = hash;

  schema.methods.compare = compare;
  
  schema.statics.findOneOrCreate = findOneOrCreate('_oauth');
}
