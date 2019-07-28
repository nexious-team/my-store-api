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
  response: {
    status: "Number",
    error: "Mixed",
    payload: "Mixed"
  },
  createAt: {
    type: "Date",
    default: new Date()
  }
}
