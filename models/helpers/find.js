function findOneOrCreate(field) {
  return async function (body) {
    
    const doc = await this.findOne({[field]: body[field]});
    if (doc) return doc;

    return this.create(body);
  }
}

module.exports = {
  findOneOrCreate
}