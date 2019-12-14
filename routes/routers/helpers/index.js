const { record } = require('../../../workers/call')
const { sentry } = require('../../../workers/recycle')
const { logger } = require('./logger');
const response = require('./response');

function common(req, res, next) {
  return async (err, result) => {
    if (err) {
      logger.error(`${req.method} '${req.baseUrl}' \n=> Error said: ${err}`);
      return next(err);
    }

    const { permission } = res.locals;
    const data = result ? filter(permission, result) : result;

    if (req.method === 'DELETE' && result) {
      result.force = req.query.force === 'true';

      try {
        await result.remove();
      } catch (err) {
        res.status(500).send(err.message);
        return;
      }

      sentry.collect(req, result);
    }

    const json = result ? { status: 200 } : { payload: null };
    res.json(response[200]("Success", data));

    record(req, json);
  }
}

function filter(permission, data) {
  return permission.filter(lean(data));
}

function lean(document) {
  return JSON.parse(JSON.stringify(document));
}

function exclude(document, fields) {
  const filtered = Object.keys(document.toObject())
    .filter(key => !fields.includes(key))
    .reduce((obj, key) => {
      obj[key] = document[key];
      return obj;
    }, {});

  return filtered;
}

function copy(source, target) {
  for (let key in source) {
    if (typeof target[key] === 'object') copy(target[key], source[key]);
    else target[key] = source[key];
    continue;
  }
}

module.exports = {
  copy,
  common,
  exclude,
  filter,
  lean,
  logger,
  queryMapper: require('./queryMapper'),
  response
}
