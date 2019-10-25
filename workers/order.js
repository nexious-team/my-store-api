const Models = require('../models');

/**
 * 
 * @param {*} param0 order_detail document
 * @param {*} callback 
 */

 async function decreaseProductStock({_product, quantity, _product_unit}) {
  console.log('decreaseProductStock: starting ...');
  
  const stock = await Models['stock'].findOne({_product });
  const units = await Models['product_unit'].find({_product});

  if (stock._product_unit === _product_unit) {
    stock.quantity = stock.quantity - quantity;
    const result = await stock.save();
    return [null, result];
  }
  
  const orderUnit = units.find(unit => unit._id.equals(_product_unit));
  const stockUnit = units.find(unit => unit._id.equals(stock._product_unit));

  const stockInEachUnit = (stock.quantity * stockUnit.quantity) - (quantity * orderUnit.quantity);
  stock.quantity = stockInEachUnit / stockUnit.quantity;
  const result = await stock.save();

  console.log('decreaseProductStock: return ' + [null, result]);
  return [null, result];
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
  decreaseProductStock,
  increaseProductQty
}
