const { record } = require('../../../workers/call')
const { sentry } = require('../../../workers/recycle')
const { logger } = require('./logger');

function common(req, res, next) {
  return (err, result) => {
    if(err) return next(err);
    const data = result ? res.locals.permission.filter(lean(result)): result;
    res.json(data);
    const response = result ?  { status: 200 } : { payload: null };
    record(req, response);
    if (req.method === 'DELETE' && result) sentry.collect(req, result);
  }
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

function copy(target, source) {
  for(let key in source) {
    if( typeof target[key] === 'object') copy( target[key], source[key] );
    else target[key] = source[key];
    continue;
  }
}

module.exports = {
  lean,
  exclude,
  copy,
  common,
  logger,
  queryMapper: require('./queryMapper')
}
