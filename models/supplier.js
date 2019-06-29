module.exports = {
  products: [{
    type: "ObjectId",
    ref: "Product"
  }],
  name: {
    type: String,
    required: true
  },
  address: {
    house: String,
    street: String,
    commune: String,
    district: String,
    province: String,
  },
  contacts: {
    type: [String],
    required: true,
    default: undefined
  },
  email: String,
  info: String
}
