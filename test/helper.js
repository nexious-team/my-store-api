const Models = require('../models');

const insert = async (model, body) => {
  await Models[model].create(body);
}

const clear = async (model) => {
  await Models[model].deleteMany({});
};

const clearAndInsert = async (model, body) => {
  await clear(model);
  await insert(model, body);
}

module.exports = {
  insert,
  clear,
  clearAndInsert,
}