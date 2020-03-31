const { calculateOrderTotalAmount } = require('./order');
const { updatePaymentAmount } = require('./payment');

const calculateAndUpdatePaymentAmount = async ({ _order, _payment }) => {
  try {
    const [err1, amount] = await calculateOrderTotalAmount({ _id: _order });
    if (err1) throw err1;

    const [err2] = await updatePaymentAmount({ _id: _payment, amount });
    if (err2) throw err2;

    return [null, true];
  } catch (err) {
    return [err];
  }
};

module.exports = {
  calculateAndUpdatePaymentAmount,
};
