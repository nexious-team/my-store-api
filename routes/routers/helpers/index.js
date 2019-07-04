function common(res, next) {
  return (err, result) => {
    if(err) return next(err);
    const data = res.locals.permission.filter(lean(result));
    res.json(data);
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
  queryMapper: require('./queryMapper')
}
