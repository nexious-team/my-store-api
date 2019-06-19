const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const category = require('./category');
const product = require('./product');
const staff = require('./staff');
const supplier = require('./supplier');
const user = require('./user');

module.exports = {
  category: model("Category", new Schema(category)),
  product: model("Product", new Schema(product)),
  staff: model("Staff", new Schema(staff)),
  supplier: model("Supplier", new Schema(supplier)),
  user: model("User", new Schema(user)),
}
