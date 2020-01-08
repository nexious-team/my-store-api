const { record } = require('../../../workers/call');
const { sentry } = require('../../../workers/recycle');
const { logger } = require('./logger');
const response = require('./response');
const queryMapper = require('./queryMapper');

function common(req, res, next) {
  return (err, result) => {
    if (err) {
      next(err);
    } else {
      const { permission } = res.locals;

      const data = result ? filter(permission, result) : result;

      res.json(response[200]('Success', data));

      const json = result ? { status: 200 } : { payload: null };
      record(req, json);
      if (req.method === 'DELETE' && result) sentry.collect(req, result);
    }
  };
}

function filter(permission, data) {
  return permission.filter(lean(data));
}

function lean(document) {
  return JSON.parse(JSON.stringify(document));
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
  queryMapper,
  response,
};
