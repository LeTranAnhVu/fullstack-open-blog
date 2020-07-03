const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {SECRET} = require('../utils/config')

const validateUser = (req, res, next) => {
  let {username, password} = req.body
  username = username.trim()
  password = password.trim()

  if (!username) {
    return res.status(400).send({error: 'Username is required'})
  }
  if (!password) {
    return res.status(400).send({error: 'Password is required'})
  }
  req.body = {...req.body, username, password}
  return next()
}

const auth = [validateUser, async (req, res, next) => {
  try {
    const {username, password} = req.body
    const user = await User.findOne({username})

    const isCorrectPw = user ? await bcrypt.compare(password, user.passwordHash) : false

    if (!isCorrectPw) {
      return res.status(401).send({error: 'invalid username or password'})
    }
    const payload = {
      username: user.username,
      id: user._id
    }
    const token = jwt.sign(payload, SECRET)

    return res.json({...user.toJSON(), token})
  } catch (e) {
    next(e)
  }
}]

const getTokenFrom = (req) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

const authenticate = async (req, res, next) => {
  const token = getTokenFrom(req)
  try {
    if (token) {
      const {username, id} = jwt.verify(token, SECRET)
      const user = await User.findById(id)
      if (!user) {
        res.status(401).send({error: 'Un-authorization'})
      }
      req.user = user
      next()
    } else {
      res.status(401).send({error: 'Un-authorization'})
    }
  } catch (e) {
    next(e)
  }


}
module.exports = {
  login: auth,
  authenticate
}