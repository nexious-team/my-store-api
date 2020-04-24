const Models = require('../models');

async function calculateOrderTotalAmount({ _id }) {
  try {
    console.log('calculateOrderTotalAmount: starting ...');
    const orderDetails = await Models.order_detail.find({ _order: _id });

    const result = orderDetails.reduce((sum, item) => {
      sum += item.amount;
      return sum;
    }, 0);

    console.log(`calculateOrderTotalAmount: return ${result}`);
    return [null, result];
  } catch (err) {
    return [err];
  }
}

async function isOrderPaid({ _id }) {
  try {
    const doc = await Models.order.findById(_id);
    if (!doc) throw new Error(`Not found: order of ${_id}`);
    if (!doc._payment) {
      return [null, false, doc, null];
    }
    const payment = await Models.payment.findById(doc._payment);
    if (payment.status !== 'succeeded') {
      return [null, false, doc, payment];
    }
    return [null, true, doc, payment];
  } catch (err) {
    return [err];
  }
}

module.exports = {
  calculateOrderTotalAmount,
  isOrderPaid,
};
