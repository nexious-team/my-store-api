const jwt = require('jsonwebtoken');

const keys = {
  user: {
    secret: 'store-user-secret',
    exp: '24h'
  }
}

const sign = (payload, key, exp) =>  jwt.sign(payload, key, { expiresIn: exp });
const verify = (token, key) => jwt.verify(token, key);

module.exports = {
  keys,
  signUser: (id) => sign({ id }, keys.user.secret, keys.user.exp),
  verifyUser: (token) => verify(token, keys.user.secret)
}
