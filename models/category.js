module.exports.definition = {
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
  },
}

module.exports.middlewares = (schema) => {
  schema.pre('remove', function (next) {
    if (!this.force) {
      this.model('Product').findOne({ _categories: { $in: this.id } }, function (err, doc) {
        if (err)
          next(err);
        if (doc)
          next(new Error('Category already assign to one or more product'));
        next();
      });
    } else {
      this.model('Product').updateMany({ _categories: { $in: this.id } }, { $pull: { _categories: this.id } }, function (err, docs) {
        if (err)
          next(err);
        next();
      });
    }
  })
}
