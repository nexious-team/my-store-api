const AccessControl = require('accesscontrol');
const Permission = require('../models')['permission'];

const ac = module.exports = new AccessControl();

(async () => {
  const docs = await Permission.find().lean();
  
  ac.setGrants(docs);
  ac.lock();
})()