const
  mongoose = require('mongoose'),
  newsletterSchema = new mongoose.Schema({
      email: { type: String, unique: true, required: true, uniqueCaseInsensitive: true }
  })

  module.exports = mongoose.model('Newsletter', newsletterSchema)
