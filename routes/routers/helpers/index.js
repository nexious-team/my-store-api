const createError = require('http-errors');
const { record } = require('../../../workers/call');
const { sentry } = require('../../../workers/recycle');
const { logger } = require('./logger');
const response = require('./response');
const queryParser = require('./queryParser');

function lean(document) {
  return JSON.parse(JSON.stringify(document));
}

function filter(permission, data) {
  return permission.filter(lean(data));
}

function common(req, res, next) {
  return async (err, result) => {
    if (err) {
      next(err);
    } else if (!result) {
      next(createError(404));
    } else {
      const { permission } = res.locals;
      const data = result ? filter(permission, result) : result;

      const json = result ? { status: 200 } : { payload: null };
      const [errRecord] = await record(req, json);
      if (errRecord) throw errRecord;
      if (req.method === 'DELETE' && result) sentry.collect(req, result);

      res.json(response[200](undefined, data));
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

const isNotNullObjectHasProperties = (obj) => (
  obj !== null && typeof obj === 'object' && Object.keys(obj).length > 0
);

module.exports = {
  copy,
  common,
  exclude,
  filter,
  lean,
  logger,
  queryParser,
  response,
  isNotNullObjectHasProperties,
};
