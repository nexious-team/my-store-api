const Models = require('../models');

// Create an order
function decreaseProductQty( id, qty, callback ) {
  Models['product'].findById( id, ( err, doc ) => {
    if (err) return callback(err);
    if (doc.qty < qty)
      return callback(new Error("Can't decrease roduct quantity since it is less than order quantity!"));

    doc.qty = doc.qty - qty;
    doc.save(callback);
  })
}

// Create an import order || user cancel an order
function increaseProductQty( id, qty, callback) {
  Models['product'].findById(id, (err, doc) => {
    if(err) return callback(err);
    doc.qty = doc.qty + qty;
    doc.save(callback);
  })
}

module.exports = {
  decreaseProductQty,
  increaseProductQty
}
