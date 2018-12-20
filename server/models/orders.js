const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema
mongoose.plugin(uniqueValidator)

const OrdersSchema = new Schema({
  products: [{
  	product: {
      type: Schema.ObjectId,
      ref: 'Products'
    },
		totalPrice: Number,
		number: Number
	}],
	customer: {
  	fullName: { type: String },
  	phone: { type: String },
  	email: { type: String },
  	address: { type: String }
	},
  engraving: { type: String },
	isDone: {
		type: Boolean,
		default: false
	}
},{ timestamps: true })

OrdersSchema.set('toJSON', { versionKey: false })

OrdersSchema.pre('remove', function(next) {
  // 'this' is the client being removed. Provide callbacks here if you want
  // to be notified of the calls' result.
  //this.model('Voucher').remove({ user: this._id }, next);
  console.log("==> pre remove test".green);
  next();
});

module.exports = mongoose.model('Orders', OrdersSchema)
