const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

const createPayment = async ({ amount }) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: 'usd',
    // Verify your integration in this guide by including this parameter
    metadata: { integration_check: 'accept_a_payment' },
  });

  return paymentIntent;
};

const getPayment = async (id) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(id);
  return paymentIntent;
};

const updatePayment = async (id, update) => {
  const paymentIntent = await stripe.paymentIntents.update(id, update);
  return paymentIntent;
};

module.exports = {
  createPayment,
  getPayment,
  updatePayment,
};
