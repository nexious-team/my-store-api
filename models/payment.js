module.exports = {
  _user: {
    type: "ObjectId",
    ref: "User",
    required: true
  },
  method: String,
  credential: Object,
	info: String,
	create_date: {
		type: Date,
		default: new Date(),
	},
	update_date: {
		type: Date
	},

}
