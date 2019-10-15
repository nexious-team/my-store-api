const { role: Role } = require('../models');

function createRole(_identity, role, model) {
  const Model = model[0].toUpperCase() + model.slice(1).toLowerCase();
  Role.create({ _identity, role , refModel: Model }, (err, doc) => {
    if (err) return console.log(err);
    console.log("Create role: " + doc);
  });
}

module.exports = {
  createRole
}