const Models = require('../models');

// Create an order
function decreaseProductQty( _id, quantity, callback ) {
  Models['stock'].findOne( {_product: _id }, ( err, doc ) => {
    if (err) return callback(err);
    if (doc.quantity < quantity)
      return callback(new Error("Can't decrease product quantity since it is less than order quantity!"));

    doc.quantity = doc.quantity - quantity;
    doc.save(callback);
  })
}

// Create an import order || user cancel an order
function increaseProductQty( id, quantity, callback) {
  Models['product'].findById(id, (err, doc) => {
    if(err) return callback(err);
    doc.quantity = doc.quantity + quantity;
    doc.save(callback);
  })
}

module.exports = {
  decreaseProductQty,
  increaseProductQty
}
