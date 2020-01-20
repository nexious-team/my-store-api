const { record } = require('../../../workers/call');
const { sentry } = require('../../../workers/recycle');
const { logger } = require('./logger');
const response = require('./response');
const query = require('./query');

function lean(document) {
  return JSON.parse(JSON.stringify(document));
}

function filter(permission, data) {
  return permission.filter(lean(data));
}

function common(req, res, next) {
  return (err, result) => {
    if (err) {
      next(err);
    } else if (!result) {
      res.status(404).json(response[404](undefined, result));
    } else {
      const { permission } = res.locals;

      const data = result ? filter(permission, result) : result;

      res.json(response[200](undefined, data));

      const json = result ? { status: 200 } : { payload: null };
      record(req, json);
      if (req.method === 'DELETE' && result) sentry.collect(req, result);
    }
  };
}

function exclude(document, fields) {
  const filtered = Object.keys(document.toObject())
    .filter((key) => !fields.includes(key))
    .reduce((obj, key) => {
      obj[key] = document[key];
      return obj;
    }, {});

  return filtered;
}

function copy(source, target) {
  for (const key in source) {
    if (typeof target[key] === 'object') copy(target[key], source[key]);
    else target[key] = source[key];
  }
}

module.exports = {
  copy,
  common,
  exclude,
  filter,
  lean,
  logger,
  query,
  response,
};
