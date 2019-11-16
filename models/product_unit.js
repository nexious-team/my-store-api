module.exports = {
	_unit: {
		type: 'ObjectId',
		required: true,
		ref: 'Unit'
	},
	_product: {
		type: 'ObjectId',
		required: true,
		ref: 'Product'
	},
	quantity: {
		type: 'Number',
		required: true
	},
	max_order: { 
		type: 'Number',
		required: true
	},
	price: {
		type: 'Number',
		required: true
	},
  info: 'String',
	create_date: {
		type: 'Date',
		default: new Date(),
	},
	update_date: {
		type: 'Date'
	},
}