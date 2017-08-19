const
  User = require('../models/User.js')

module.exports = {
  index: (req, res) => {

  },
  users: (req, res) => {
    User.find({}, (err, users) => {
      if(err) return (err)
      res.json(users)
    })
  },
  show: (req, res) => {

  },
  edit: (req, res) => {
    User.findById(req.params.id, (err, user) => {
      res.render('users/edit', {user: user})
    })
  },
  destroy: (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, deleteUser) => {
      if(err) return console.log(err)
      res.redirect('/')
    })
  },
  update: (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, user) => {
      if(err) {return (err)}
      res.redirect('/profile')
    })
  }
}
