const common = require('./common');
const populate = require('./populate');
const user = require('./user');
const order = require('./order');
const orderDetail = require('./order_detail');
const payment = require('./payment');
const importOrder = require('./import');
const importDetail = require('./import_detail');
const recycle = require('./recycle');
const util = require('./util');
const file = require('./file');
const oauth = require('./oauth');
const product = require('./product');
const brand = require('./brand');
const category = require('./category');
const shipment = require('./shipment');

module.exports = {
  common,
  populate,
  user,
  order,
  orderDetail,
  payment,
  importOrder,
  importDetail,
  recycle,
  util,
  file,
  oauth,
  product,
  brand,
  category,
  shipment,
};
