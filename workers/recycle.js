const Models = require('../models');

function collect({ user: { id: caller } }, document) {
  Models['recycle'].create({
    caller,
    model: document.constructor.modelName.toLowerCase(),
    document: JSON.parse(JSON.stringify(document)),
  }, (err, doc) => {
    if (err) return console.log(err);
    console.log("SENTRY COLLECT: " + doc);
  })
}

function restore(trash, callback) {
  Models[trash.model.toLowerCase()].create(trash.document, (err, doc) => {
      if (err) return console.log(err);
      trash.remove((err, result) => {
        if (err) return console.log("RECYCLE REMOVE: " + err);
        console.log("RECYCLE REMOVE: " + result);
      });
      callback(doc);
      console.log("SENTRY RESTORE: " + doc);
  })
}

module.exports = {
  sentry: {
    collect,
    restore,
  }
}
