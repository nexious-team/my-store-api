const Models = require('../models');

const calculateOrderAmount = async ({ product: id, qty }) => {
  const doc = await Models['product'].findById(id);
  if (!doc) throw new Error("Function calculateOrderAmount can't found product!");
  return qty * doc.price;
}

const calculateImportAmount = ({ price, qty }) => (price * qty)

module.exports = {
  calculateOrderAmount,
  calculateImportAmount
}
