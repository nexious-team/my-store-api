const Models = require('../models');

const calculateOrderAmount = async ({ product: id, qty }) => {
  const { price } = await Models['product'].findById(id);
  return qty * price;
}

const calculateImportAmount = ({ price, qty }) => (price * qty)

module.exports = {
  calculateOrderAmount,
  calculateImportAmount
}
