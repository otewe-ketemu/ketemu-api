const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bCrypt = require('bcrypt')
const saltRounds = 10
let methods = {}

methods.signUp = (req, res) => {
  let pwd = req.body.password

  if (req.body.name.length === 0) {
    res.json({
      status: false,
      message: 'Name is required!'
    })
  } else if (req.body.username.length === 0) {
    res.json({
      status: false,
      message: 'Username is required!'
    })
  } else if (req.body.username.length < 5) {
    res.json({
      status: false,
      message: 'Minimal Username length is 5 characters!'
    })
  } else if (req.body.password.length === 0) {
    res.json({
      status: false,
      message: 'Password is required!'
    })
  } else if (req.body.password.length < 5) {
    res.json({
      status: false,
      message: 'Minimal Password length is 5 characters!'
    })
  } else if (req.body.email.length === 0) {
    res.json({
      status: false,
      message: 'Email is required!'
    })
  } else {
    User.findOne({email: req.body.email}, (err, result) => {
      if (result === null) {
        User.findOne({username: req.body.username}, (error, record) => {
          if (error) {
            res.json({
              status: false,
              message: 'SASASASAS'
            })
          } else if (record === null) {
            let newUser = new User({
              name: req.body.name,
              username: req.body.username,
              password: bCrypt.hashSync(pwd, saltRounds),
              email: req.body.email
            })
            newUser.save((err, data) => {
              if (err) res.json({err})
              res.json({
                status: true,
                data
              })
            })
          } else {
            res.json({
              status: false,
              message: 'Username is already used!'
            })
          }
        })
      } else {
        res.json({
          status: false,
          message: 'Email is already used!'
        })
      }
    })
  }
} //signup

methods.signIn = (req, res) => {
  let pwd = req.body.password

  if (req.body.username.length === 0) {
    res.json({
      status: false,
      message: 'Username is required!'
    })
  } else {
    User.findOne({
      username: req.body.username
    })
    .then(record => {
      if (pwd.length === 0) {
        res.json({
          status: false,
          message: 'Password is required!'
        })
      } else {
        if (bCrypt.compareSync(pwd, record.password)) {
          let token = jwt.sign({
            id: record._id,
            username: record.username,
            email: record.email
          }, process.env.SECRET_KEY, { expiresIn: '1d'})
          res.json({
            message: 'SignIn success',
            id: record._id,
            username: record.username,
            token
          })
        } else {
          res.json({
            message: 'Please input the correct password!'
          })
        }
      }
    })
    .catch(error => {
      res.json({
        status: false,
        message: 'Please input the correct username!'
      })
    })
  }
} //signin biasa

methods.getAllUsers = (req, res) => {
  User.find({}, (err, records) => {
    if (err) res.json({err})
    res.json(records)
  })
} // getAllUser

methods.getUserById = (req, res) => {
  User.findById(req.params.id, (err, record) => {
    if (err) res.json({err})
    res.json(record)
  })
} //getUserById

methods.getUserByUsername = (req, res) => {
  User.findOne({username: req.params.username}, (err, result) => {
    if (result == null) {
      res.json({
        status: true,
        message: 'Success!'
      })
    } else {
      res.json({
        status: false,
        message: 'Username has already exists!'
      })
    }
  })
} //getUserById

methods.getHomeAddressGeolocation = (req, res) => {
  User.findById(req.params.id, (err, record) => {
    if (err) res.json({err})
    res.json(record.homeAddressGeolocation)
  })
} //getHomeAddressGeolocation

methods.getOfficeAddressGeolocation = (req, res) => {
  User.findById(req.params.id, (err, record) => {
    if (err) res.json({err})
    res.json(record.officeAddressGeolocation)
  })
} //getOfficeAddressGeolocation

methods.searchByUsername = (req, res) => {
  let regexUser = new RegExp('\\b' + req.params.username, 'i')
  User.find({username: regexUser}, (err, records) => {
    if(err) res.json({err})
    res.json(records)
  })
} //searching through database for partial username

methods.editUser = (req, res) => {
  let pwdUser = req.body.password
    User.findById(req.params.id)
    .exec((error, response) => {
      if (error) res.json({error})
      User.findByIdAndUpdate({
        "_id": response._id
      }, {
        $set: {
          "name": req.body.name || response.name,
          "username": req.body.username || response.username,
          "password": bCrypt.hashSync(pwdUser, saltRounds) || response.password,
          "email": req.body.email || response.email,
          "avatarURL": req.body.avatarURL || response.avatarURL,
          "homeAddressName": req.body.homeAddressName || response.homeAddressName,
          "homeAddressGeolocation": req.body.homeAddressGeolocation || response.homeAddressGeolocation,
          "officeAddressName": req.body.officeAddressName || response.officeAddressName,
          "officeAddressGeolocation": req.body.officeAddressGeolocation || response.officeAddressGeolocation,
          "updatedDate": Date.now()
        }
      }, {
        new: true
      })
      .exec((err, result) => {
        if (err) res.json({err})
        res.json(result)
      })
    })
} //editUser

methods.updateAvatarUrl = (req, res) => {
  User.findById(req.params.id, (err, record) => {
    if(err) res.json({err})
    record.avatarURL = req.body.avatar
    record.save((error, data) => {
      res.json(data)
    })
  })
}

methods.deleteUserById = (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, record) => {
      if (err) res.json({err})
      res.json(record)
    })
} //deleteUser

module.exports = methods
