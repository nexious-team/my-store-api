module.exports = {
  _categories: {
    type: ['ObjectId'],
    required: true,
    ref: 'Category',
  },
  _brand: {
    type: 'ObjectId',
    ref: 'Brand',
  },
  _images: {
    type: ['ObjectId'],
    ref: 'Image',
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
