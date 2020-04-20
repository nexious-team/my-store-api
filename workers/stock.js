const Models = require('../models');

/**
 *
 * @param {*} param0 order_detail document
 * @param {*} callback
 */

async function decreaseProductStock({ _product, quantity, _product_unit: _productUnit }) {
  try {
    console.log('decreaseProductStock: starting ...');

    const stock = await Models.stock.findOne({ _product });
    const units = await Models.product_unit.find({ _product });

    if (stock._product_unit === _productUnit) {
      stock.quantity -= quantity;
      const result = await stock.save();
      return [null, result];
    }

    const orderUnit = units.find((unit) => unit._id.equals(_productUnit));
    const stockUnit = units.find((unit) => unit._id.equals(stock._product_unit));

    const stockInEachUnit = (stock.quantity * stockUnit.quantity) - (quantity * orderUnit.quantity);
    stock.quantity = stockInEachUnit / stockUnit.quantity;
    const result = await stock.save();

    console.log(`decreaseProductStock: return ${[null, result]}`);
    return [null, result];
  } catch (error) {
    console.log(error);
    return [error];
  }
}

/**
 * Create an import order || user cancel an order
 * @param {*} param0 order detail document
 */

async function increaseProductStock({ _product, quantity, _product_unit: _productUnit }) {
  try {
    console.log('increaseProductStock: starting ...');
    let stock = await Models.stock.findOne({ _product });
    if (!stock) {
      stock = await Models.stock.create({ _product, _product_unit: _productUnit, quantity });
      return [null, stock];
    }
    const units = await Models.product_unit.find({ _product });

    if (stock._product_unit === _productUnit) {
      stock.quantity += quantity;
      const result = await stock.save();
      return [null, result];
    }

    const orderUnit = units.find((unit) => unit._id.equals(_productUnit));
    const stockUnit = units.find((unit) => unit._id.equals(stock._product_unit));

    const stockInEachUnit = (stock.quantity * stockUnit.quantity) + (quantity * orderUnit.quantity);
    stock.quantity = stockInEachUnit / stockUnit.quantity;
    const result = await stock.save();

    console.log(`increaseProductStock: return ${[null, result]}`);
    return [null, result];
  } catch (error) {
    console.log(error);
    return [error];
  }
}

module.exports = {
  increaseProductStock,
  decreaseProductStock,
};
