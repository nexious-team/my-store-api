module.exports = {
	_unit: {
		type: "ObjectId",
		required: true,
	},
	_product: {
		type: "ObjectId",
		required: true
	},
	quantity: {
		type: Number,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
  info: String,
	create_date: {
		type: Date,
		default: new Date(),
	},
	update_date: {
		type: Date
	},

}