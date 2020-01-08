const Models = require('../models');

/**
 *
 * @param {*} param0 order_detail document
 * @param {*} callback
 */

async function decreaseProductStock({ _product, quantity, _product_unit: productUnit }) {
  console.log('decreaseProductStock: starting ...');

  const stock = await Models.stock.findOne({ _product });
  const units = await Models.product_unit.find({ _product });

  if (stock._product_unit === productUnit) {
    stock.quantity -= quantity;
    const result = await stock.save();
    return [null, result];
  }

  const orderUnit = units.find((unit) => unit._id.equals(productUnit));
  const stockUnit = units.find((unit) => unit._id.equals(stock._product_unit));

  const stockInEachUnit = (stock.quantity * stockUnit.quantity) - (quantity * orderUnit.quantity);
  stock.quantity = stockInEachUnit / stockUnit.quantity;
  const result = await stock.save();

  console.log(`decreaseProductStock: return ${[null, result]}`);
  return [null, result];
}

/**
 * Create an import order || user cancel an order
 * @param {*} param0 order detail document
 * @param {*} callback
 */

async function increaseProductStock({ _product, quantity, _product_unit: productUnit }, callback) {
  console.log('increaseProductStock: starting ...');
  const stock = await Models.stock.findOne({ _product });
  const units = await Models.product_unit.find({ _product });

  if (stock._product_unit === productUnit) {
    stock.quantity += quantity;
    const result = await stock.save();
    return [null, result];
  }

  const orderUnit = units.find((unit) => unit._id.equals(productUnit));
  const stockUnit = units.find((unit) => unit._id.equals(stock._product_unit));

  const stockInEachUnit = (stock.quantity * stockUnit.quantity) + (quantity * orderUnit.quantity);
  stock.quantity = stockInEachUnit / stockUnit.quantity;
  const result = await stock.save();

  console.log(`increaseProductStock: return ${[null, result]}`);
  return [null, result];
}

module.exports = {
  decreaseProductStock,
  increaseProductStock,
};
