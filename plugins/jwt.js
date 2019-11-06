const jwt = require('jsonwebtoken');

const keys = {
  user: {
    secret: 'store-user-secret',
    exp: '24h'
  },
  verify_email: {
    secret: 'store-verify-email',
    exp: '5m'
  },
  reset_password: {
    secret: 'store-reset-password',
    exp: '5m'
  }
}

const sign = (payload, key, exp) =>  jwt.sign(payload, key, { expiresIn: exp });
const verify = (token, key) => jwt.verify(token, key);

module.exports = {
  keys,
  generateToken: (payload, issue) => sign(payload, keys[issue].secret, keys.user.exp),
  decodeToken: (token, issue) => verify(token, keys[issue].secret),
}
