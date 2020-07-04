const User = require('../models/user')
const Blog = require('../models/blog')

const testingReset = async (req, res, next) => {
  try {
    await User.deleteMany()
    await Blog.deleteMany()
    res.status(204).end()
  } catch (e) {
    next(e)
  }


}


module.exports = {
  testingReset
}