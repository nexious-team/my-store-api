const Models = require('../models');

function collect({ user: { id: caller } }, document) {
  const modelName = document.constructor.modelName.toLowerCase();
  Models.recycle.create({
    caller,
    model: modelName,
    document: JSON.parse(JSON.stringify(document)),
  }, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`COLLECT: a ${modelName}`);
    }
  });
}

function restore(trash, callback) {
  Models[trash.model.toLowerCase()].create(trash.document, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      trash.remove((errRemove, result) => {
        if (errRemove) {
          console.log(`RECYCLE REMOVE: ${err}`);
        } else {
          console.log(`RECYCLE REMOVE: ${result}`);
        }
      });
      callback(doc);
      console.log(`SENTRY RESTORE: ${trash.model}`);
    }
  });
}

module.exports = {
  sentry: {
    collect,
    restore,
  },
};
