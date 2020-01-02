module.exports = {
  email: {
    validator(v) {
      return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
    },
    message: messager('email')
  },
  phone_number: {
    validator(v) {
      return /^((\+855)|(\(\+855\))|0)[1-9]\d( |-)\d{3}( |-)\d{3,4}/.test(v) || 
            /^((\+855)|(\(\+855\))|0)[1-9]\d( |-)\d{2}( |-)\d{2}( |-)\d{2,3}/.test(v);
    },
    message: messager('phone number')
  },
  url: {
    validator(v) {
      return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(v)
    },
    message: messager('url')
  }
}

function messager(key) {
  return ({ value }) => `${value} is not a valid ${key}!`;
}