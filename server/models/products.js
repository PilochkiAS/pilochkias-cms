const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema
mongoose.plugin(uniqueValidator)

const ProductsSchema = new Schema({
	title: {
		type: String,
		required: 'Product title is required'
	},
	description: {
		type: String,
		// unique:'User with email "{VALUE}" already exist.',
	},
	mainImage: {
		type: String,
	},
	secondImage: {
		type: String,
	},
	category: {
		type: Number,
    required: 'Product category is required'
	},
	price: {
		type: Number,
    required: 'Product price is required'
	},
	discount: {
		type: Number,
	},
	isPublished:{
		type: Boolean,
		default: false
	}
},{ timestamps: true })

ProductsSchema.set('toJSON', { versionKey: false })

ProductsSchema.pre('remove', function(next) {
  // 'this' is the client being removed. Provide callbacks here if you want
  // to be notified of the calls' result.
  //this.model('Voucher').remove({ user: this._id }, next);

  console.log("==> pre remove test".green);
  next();
});

module.exports = mongoose.model('Products', ProductsSchema)
