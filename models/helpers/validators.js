function messager(key, detail) {
  return ({ value }) => `${value} is not a valid ${key}! ${detail || ''}`;
}

module.exports = {
  email: {
    validator(v) {
      // eslint-disable-next-line no-useless-escape
      return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
    },
    message: messager('email'),
  },
  phone_number: {
    validator(v) {
      return /^((\+855)|(\(\+855\))|0)[1-9]\d( |-)\d{3}( |-)\d{3,4}/.test(v)
            || /^((\+855)|(\(\+855\))|0)[1-9]\d( |-)\d{2}( |-)\d{2}( |-)\d{2,3}/.test(v);
    },
    message: messager('phone number', 'Correct format: (+855)12 34 56 78[0] | 012-345-678[0]'),
  },
  url: {
    validator(v) {
      // eslint-disable-next-line no-useless-escape
      return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(v);
    },
    message: messager('url'),
  },
};
