const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema
mongoose.plugin(uniqueValidator)

const ImagesSchema = new Schema({
  img: {
  	data: Buffer,
		contentType: String,
		size: Number,
  },
  title: String,
},{ timestamps: true })

ImagesSchema.set('toJSON', { versionKey: false })

ImagesSchema.pre('remove', function(next) {
  // 'this' is the client being removed. Provide callbacks here if you want
  // to be notified of the calls' result.
  //this.model('Voucher').remove({ user: this._id }, next);

  console.log("==> pre remove test".green);
  next();
});

module.exports = mongoose.model('Images', ImagesSchema)
