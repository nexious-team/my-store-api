module.exports = {
  name: {
    type: 'String',
    required: true,
    unique: true,
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
