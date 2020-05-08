const createError = require('http-errors');
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
  try {
    const doc = await Models.payment.findById(_id);
    if (!doc) throw createError(404, `Not found payment of id ${_id}`);

    const paymentIntent = await getPayment(doc._stripe);
    const match = doc.status === paymentIntent.status;

    return [null, match, doc, paymentIntent];
  } catch (err) {
    return [err];
  }
}

module.exports = {
  checkPaymentStatus,
  updatePaymentAmount,
};
