const jwt = require('jsonwebtoken');

const keys = {
  user: {
    secret: 'store-user-secret',
    exp: '24h'
  },
  staff: {
    secret: 'store-staff-secret',
    exp: '24h'
  }
}

const sign = (payload, key, exp) =>  jwt.sign(payload, key, { expiresIn: exp });
const verify = (token, key) => jwt.verify(token, key);

module.exports = {
  keys,
  generateToken: (id, issue) => sign({ id }, keys[issue].secret, keys.user.exp),
  decodeToken: (token, issue) => verify(token, keys[issue].secret)
}
