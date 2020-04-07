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
const image = require('./image');
const oauth = require('./oauth');
const product = require('./product');

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
  image,
  oauth,
  product,
};
