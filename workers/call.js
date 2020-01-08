const Models = require('../models');

function record({ user: { id: _caller }, method, originalUrl, body }, response) {
  Models.call.create({
    _caller,
    method,
    body,
    response,
    original_url: originalUrl,
  }, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log({ RECORD: result });
    }
  });
}

module.exports = {
  record,
};
