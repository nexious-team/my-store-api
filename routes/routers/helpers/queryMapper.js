module.exports = (query) => {
  const { select, page, limit, sort, ...filter } = query;

  const conditions = mapConditions(filter);
  const options = mapOptions(page, limit, sort);

  return {
    conditions,
    select,
    options
  }
}

const mapConditions = (filter) => {
  const conditions = {};
  for (let key in filter) {
    if (Array.isArray( filter[key] ) )
      conditions[key] = { $in: filter[key] };
    else if (!isNaN( filter[key] ) ) {
      if ( filter[key][0] === ' ') conditions[key] = { $gt: filter[key] };
      else if ( filter[key][0] === '-') conditions[key] = { $lt: filter[key].substring(1) };
      else conditions[key] = { $eq: filter[key] };
    }
    else
      conditions[key] = filter[key];
  }

  return conditions;
}

const mapOptions = (page = 1, limit = 25, sort = {}) => {
  limit = isNaN(limit) ? 25 : parseInt(limit);
  page = isNaN(page) || page === '0'? 1 : parseInt(page);
  let skip = (page - 1) * limit;

  return { skip, limit, sort };
}
