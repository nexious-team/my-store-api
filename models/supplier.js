module.exports = {
  _image: {
    type: 'ObjectId',
    ref: 'Image',
  },
  name: {
    type: 'String',
    required: true,
  },
  email: {
    type: 'String',
  },
  contact: {
    type: ['String'],
    required: true,
    default: undefined,
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
    type: 'Date',
  },

};
