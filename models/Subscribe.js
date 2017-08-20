const
  mongoose = require('mongoose'),
  newsletterSchema = new mongoose.Schema({
      email: String
  })

  module.exports = mongoose.model('Newsletter', newsletterSchema)
