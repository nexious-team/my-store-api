module.exports = {
  product: {
    type: "ObjectId",
    ref: "Product",
    required: true
  },
  supplier: {
    type: "ObjectId",
    ref: "Supplier",
    required: true
  },
  price: {
    type: Number,
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
    default: new Date()
  },
  info: String
}
