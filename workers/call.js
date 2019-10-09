const Models = require('../models');

function record({ user: { id: _caller }, method, originalUrl: original_url, body }, response) {
  Models['call'].create({
    _caller,
    method,
    body,
    response,
    original_url,
  }, (err, result) => {
    if (err) return console.error(err);
    console.log({ "RECORD": result });
  })
}

module.exports = {
  record
}
