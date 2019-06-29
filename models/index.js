const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const category = require('./category');
const product = require('./product');
const staff = require('./staff');
const supplier = require('./supplier');
const user = require('./user');
const importOrder = require('./import_order');
const order = require('./order');
const payment = require('./payment');

module.exports = {
  category: model("Category", new Schema(category)),
  product: model("Product", new Schema(product)),
  staff: model("Staff", new Schema(staff)),
  supplier: model("Supplier", new Schema(supplier)),
  importOrder: model("ImportOrder", new Schema(importOrder)),
  user: model("User", create(user)),
  order: model("Order", new Schema(order)),
  payment: model("Payment", new Schema(payment)),
}

function create ({ definition, middlewares, methods, statics }) {
  let schema = new Schema(definition);
  if(methods) methods(schema);
  if(middlewares) middlewares(schema);
  if(statics) statics(schema)
  return schema;
}
