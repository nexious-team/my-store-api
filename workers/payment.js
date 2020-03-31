const Models = require('../models');
const { getPayment, updatePayment } = require('../plugins/stripe');

async function updatePaymentAmount({ _id, amount }) {
  try {
    const doc = await Models.payment.findById(_id);
    const paymentIntent = await updatePayment(doc._stripe, { amount });
    doc.amount = paymentIntent.amount;
    await doc.save();

    return [null, true];
  } catch (err) {
    console.log(err);
    return [err];
  }
}

async function checkPaymentStatus({ _id }) {
  const doc = await Models.payment.findById(_id);
  const paymentIntent = await getPayment(doc._stripe);
  const match = doc.status === paymentIntent.status;

  return [match, doc, paymentIntent];
}

module.exports = {
  checkPaymentStatus,
  updatePaymentAmount,
};
