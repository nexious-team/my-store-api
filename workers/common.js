const Models = require('../models');

const error = {
  outOfStock: 'checkStockAndCalculateAmount: Product stock is not enough to make order',
  overMaxOrderProductUnit: 'checkStockAndCalculateAmount: Order quantity is bigger than max order on the product unit, you should make order with bigger product unit to get better price or the product run out of stock.',
};
const checkStockAndCalculateAmount = async ({ _product: _id, quantity, _product_unit: productUnit }) => {
  try {
    console.log('checkStockAndCalculateAmount: starting ...');
    const product = {};
    product.item = await Models.product.findById(_id).lean();
    product.stock = await Models.stock.findOne({ _product: _id }).lean();
    product.units = await Models.product_unit.find({ _product: _id }).lean();

    if (product.stock._product_unit.toString() === productUnit) {
      if (product.stock.quantity > quantity) {
        const unit = product.units.find((u) => u._id.toString() === productUnit);

        return [null, unit.price, quantity * unit.price];
      }

      throw new Error(error.outOfStock);
    } else {
      const stockUnit = product.units.find((u) => u._id.equals(product.stock._product_unit));
      const orderUnit = product.units.find((u) => u._id.equals(productUnit));

      if (orderUnit.max_order < quantity) throw new Error(error.overMaxOrderProductUnit);

      const orderQuantityInEachUnit = orderUnit.quantity * quantity;
      const stockQuantityInEachUnit = stockUnit.quantity * product.stock.quantity;

      if (stockQuantityInEachUnit < orderQuantityInEachUnit) throw new Error(error.outOfStock);

      console.log(`checkStockAndCalculateAmount: return ${[orderUnit.price, quantity * orderUnit.price]}`);
      return [null, orderUnit.price, quantity * orderUnit.price];
    }
  } catch (err) {
    console.log(err);
    return [err];
  }
};

module.exports = {
  checkStockAndCalculateAmount,
};
