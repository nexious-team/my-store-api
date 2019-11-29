const { record } = require('../../../workers/call')
const { sentry } = require('../../../workers/recycle')
const { logger } = require('./logger');
const response = require('./response');
const query = require('./query');

function common(req, res, next) {
  return (err, result) => {
    if(err) return next(err);
    if(!result) return res.status(404).json(response[404](undefined, result));

    const { permission } = res.locals;

    const data = result ? filter(permission, result) : result;

    res.json(response[200](undefined, data));

    const json = result ?  { status: 200 } : { payload: null };
    record(req, json);
    if (req.method === 'DELETE' && result) sentry.collect(req, result);
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
  for(let key in source) {
    if( typeof target[key] === 'object') copy( target[key], source[key] );
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
  query,
  response
}
