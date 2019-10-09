module.exports = {
  _caller: {
    type: "ObjectId",
    refPath: "caller_ref"
  },
  caller_ref: {
    type: String,
    required: true,
    enum: ["User", "Staff"],
    default: "User"
  },
  method: {
    type: String,
    required: true
  },
  original_url: {
    type: String,
    required:true
  },
  body: "Object",
  response: {
    status: Number,
    error: String,
    message: String,
    payload: "Mixed"
  },
  info: String,
  create_date: {
    type: Date,
    default: new Date()
  },
  update_date: {
    type: Date
  }
}
