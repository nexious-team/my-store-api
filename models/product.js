module.exports = {
  _categories: {
    type: ['ObjectId'],
    ref: 'Category',
  },
  _brand: {
    type: 'ObjectId',
    ref: 'Brand',
  },
  _images: {
    type: ['ObjectId'],
    ref: 'File',
  },
  name: {
    type: 'String',
    required: true,
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
