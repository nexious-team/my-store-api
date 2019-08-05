const Models = require('../models');

function record({ user: { id: caller }, method, originalUrl, body }, response) {
  Models['call'].create({
    caller,
    method,
    originalUrl,
    body,
    response,
  }, (err, result) => {
    if (err) return console.error(err);
    console.log({ "RECORD": result });
  })
}

module.exports = {
  record
}
