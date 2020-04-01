const Models = require('../models');

async function record({ user: { id: _caller }, method, originalUrl, body }, response) {
  try {
    const result = await Models.call.create({
      _caller,
      method,
      body,
      response,
      original_url: originalUrl,
    });

    return [null, !!result];
  } catch (err) {
    return [err];
  }
}

module.exports = {
  record,
};
