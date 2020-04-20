const mapFilters = (filter) => {
  const conditions = {};
  for (const key in filter) {
    if (Array.isArray(filter[key])) {
      conditions[key] = { $in: filter[key] };
    } else if (!isNaN(filter[key])) {
      if (filter[key][0] === ' ') conditions[key] = { $gt: filter[key] };
      else if (filter[key][0] === '-') conditions[key] = { $lt: filter[key].substring(1) };
      else conditions[key] = { $eq: filter[key] };
    } else {
      conditions[key] = filter[key];
    }
  }

  return conditions;
};

const mapOptions = (page = 1, limit = 25, sort = {}) => {
  limit = isNaN(limit) ? 25 : parseInt(limit, 10);
  page = isNaN(page) || page === '0' ? 1 : parseInt(page, 10);
  const skip = (page - 1) * limit;

  return { skip, limit, sort };
};

module.exports.parse = (query) => {
  const { select = {}, page, limit, sort, ...filter } = query;

  const filters = mapFilters(filter);
  const options = mapOptions(page, limit, sort);

  return {
    filters,
    select,
    options,
  };
};
