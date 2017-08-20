const
  Newsletter = require('../models/Subscribe.js')

  module.exports = {
    index: (req, res) => {
      Newsletter.find({}, (err, emails) => {
        if(err) return (err)
        res.json(emails)
      })
    },
    create: (req, res) => {

      var newSubscriber = new Newsletter(req.body)
      newSubscriber.email = req.body.email
      console.log(newSubscriber)
      newSubscriber.save((err, newSubscriber) => {
        if(err){
          console.log(err)
        } else {
          console.log({success: true, message: "Successfully subscribed!!!"})
            res.redirect('/')

        }
      })
    }
  }
