module.exports = {
  caller: {
    type: "ObjectId",
    refPath: "refModel",
  },
  callerRef: {
    type: "String",
    default: "User",
  },
  model: {
    type: "String",
    required: true,
  },
  document: {
    type: "Object",
    required: true,
  },
  createAt: {
    type: "Date",
    default: new Date()
  }
}
