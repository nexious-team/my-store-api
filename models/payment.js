module.exports = {
  order: {
    type: "ObjectId",
    ref: "Order",
    required: true
  },
  method: String,
  date: {
    type: Date,
    default: new Date()
  },
  credential: Object,
  info: String,
}
