module.exports.definition = {
  _image: {
    type: 'ObjectId',
    ref: 'Image'
  },
  name: {
    type: 'String',
    required: true,
    unique: true
  },
  info: 'String',
  create_date: {
    type: 'Date',
    default: new Date()
  },
  update_date: {
    type: 'Date'
  }
}

module.exports.middlewares = (schema) => {
  schema.pre('remove', function (next) {
    if (!this.force) {
      this.model('Product').findOne({ _brand: this.id }, function (err, doc) {
        if (err)
          next(err);
        if (doc)
          next(new Error('Brand already assign to one or more'));
        next();
      });
    } else {
      this.model('Product').deleteMany({ _brand: this.id }, function (err) {
        if (err)
          next(err);
        next();
      });
    }
  });
}


