const validators = require('./helpers/validators');

module.exports = {
  _image: {
    type: 'ObjectId',
    ref: "Image"
  },
  name: {
    type: 'String',
    required: true
  },
  email: {
    type: 'String',
    validate: validators['email']
  },
  contact: [{
    type: 'String',
    required: true,
    default: undefined,
    validate: validators['phone_number']
  }],
  address: {
    type: 'String'
  },
  info: 'String',
  create_date: {
    type: 'Date',
    default: new Date()
  },
  update_date: {
    type: 'Date'
  },

}
