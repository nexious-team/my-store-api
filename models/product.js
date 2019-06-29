module.exports = {
  name: {
    type: String,
    required: true
  },
  qty: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  info: String,
  category: {
    type: "ObjectId",
    required: true
  },
  createAt: {
    type: Date,
    default: new Date()
  }
}
