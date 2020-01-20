const bcrypt = require('bcryptjs');

module.exports.hash = function (password) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

module.exports.compare = function (password) {
  const match = bcrypt.compareSync(password, this.password);
  return match;
};
