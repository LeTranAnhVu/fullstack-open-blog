const User = require('../models/user')
const bcrypt = require('bcrypt')
// apis
const getAll = async (req, res, next) => {
  try {
    const users = await User.find()
    return res.json(users)
  } catch (e) {
    next(e)
  }
}

const create = async (req, res, next) => {
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
}

module.exports = {
  getAll,
  create
}