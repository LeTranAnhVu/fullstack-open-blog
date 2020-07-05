const User = require('../models/user')
const bcrypt = require('bcrypt')
// apis
const getAll = async (req, res, next) => {
  try {
    const users = await User.find().populate('blogs', {user: 0}).exec()
    return res.json(users)
  } catch (e) {
    next(e)
  }
}

const validateUser = (req, res, next) => {
  let {username, name, password} = req.body
  username = username.trim()
  name = name.trim()
  password = password.trim()

  if (!username) {
    return res.status(400).send({error: 'Username is required'})
  }
  if (!password) {
    return res.status(400).send({error: 'Password is required'})
  }
  if (password.length < 3) {
    return res.status(400).send({error: 'Password minlength is 3'})
  }
  req.body = {...req.body, username, name, password}
  return next()
}

const getById = async (req, res, next) => {
  try {
    const {id} = req.params
    const user = await User.findById(id).populate('blogs', {user: 0}).exec()
    if (!user) {
      throw new Error('Not found')
    }
    return res.json(user)
  } catch (e) {
    next(e)
  }
}

const create = [validateUser, async (req, res, next) => {
  try {
    const {username, name, password} = req.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // allow to create
    const newUser = new User({username, name, passwordHash})
    await newUser.save()
    return res.json(newUser)
  } catch (e) {
    next(e)
  }
}]

module.exports = {
  getAll,
  create,
  getById
}