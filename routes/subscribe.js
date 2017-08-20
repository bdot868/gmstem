const
  express = require('express'),
  mongoose = require('mongoose'),
  newsletterRouter = express.Router(),
  Newsletter = require('../models/Subscribe.js'),
  newsletterController = require('../controllers/subscribe.js')


newsletterRouter.route('/subscribers')
  .get(newsletterController.index)

newsletterRouter.route('/subscribe')
  .post(newsletterController.create)

module.exports = newsletterRouter
