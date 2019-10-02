module.exports = {
  caller: {
    type: "ObjectId",
    refPath: "refModel"
  },
  refModel: {
    type: "String",
    required: true,
    enum: ["User", "Staff"],
    default: "User"
  },
  method: {
    type: "String",
    required: true
  },
  originalUrl: {
    type: "String",
    required:true
  },
  body: "Object",
  response: {
    status: "Number",
    error: "String",
    message: "String",
    payload: "Mixed"
  },
  createAt: {
    type: "Date",
    default: new Date()
  }
}
