const Blog = require('../models/blog')

// apis
const getAll = async (req, res, next) => {
  try {
    const blog = await Blog.find()
    return res.json(blog)
  } catch (e) {
    next(e)
  }
}

const create = async (req, res, next) => {
  try {
    const {title, author, url, likes} = req.body
    // allow to create
    const newBlog = new Blog({title, author, url, likes})
    await newBlog.save()
    return res.json(newBlog)
  } catch (e) {
    next(e)
  }
}

module.exports = {
  getAll,
  create
}