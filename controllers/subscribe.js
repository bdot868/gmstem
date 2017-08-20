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
      console.log('hey girl')
      console.log(req.body)
      var newSubscriber = new Newsletter(req.body)
      newSubscriber.email = req.body.email
      console.log(newSubscriber)
      newSubscriber.save((err, newSubscriber) => {
        if(err){
          console.log(err)
        } else {
            res.redirect('/')
        }
      })
    }
  }
