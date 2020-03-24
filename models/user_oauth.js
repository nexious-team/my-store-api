const { findOneOrCreate } = require('./helpers/find');

module.exports.definition = {
  provider: 'String',
  id: {
    type: 'String',
    unique: true
  },
  displayName: 'String',
  name: {
    familyName: 'String',
    givenName: 'String',
    middleName: 'String'
  },
  emails: [{
    value: 'String',
    type: { 
      type: 'String'
    }
  }],
  photos: [{
    value: 'String'
  }],
}

module.exports.decorate = (schema) => {
  schema.statics.findOneOrCreate = findOneOrCreate('id');
}