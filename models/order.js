module.exports = {
  user: {
    type: "ObjectId",
    ref: "User",
    required: true
  },
  product: {
    type: "ObjectId",
    ref: "Product",
    required: true
  },
  qty: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: new Date(),
  },
  info: String
}
