const Models = require('../models');

function setOrderComplete(id, state, callback) {
  Models.order.findById(id, (err, doc) => {
    if (err) {
      callback(err);
    } else {
      doc.completed = state;
      doc.save(callback);
    }
  });
}

module.exports = {
  setOrderComplete,
};
