module.exports = {
  path: {
    type: String,
    required: true
  },
  info: String,
  create_date: {
    type: Date,
    default: new Date()
  },
  update_date: {
    type: Date
  },
}