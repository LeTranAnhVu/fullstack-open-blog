const Blog = require('../models/blog')
const User = require('../models/user')
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
    const user = req.user
    if (!user) {
      return res.status(401).send({error: 'Un-authorization'})
    }

    const {title, author, url, likes} = req.body
    // allow to create
    const newBlog = new Blog({title, author, url, likes})
    newBlog.user = user._id
    await newBlog.save()
    user.blogs = [...user.blogs, newBlog._id]
    user.save()
    return res.json(newBlog)
  } catch (e) {
    next(e)
  }
}
const deleteById = async (req, res, next) => {
  try {
    const {id} = req.params
    const blog = await Blog.findByIdAndDelete(id)
    return res.status(204).end()
  } catch (e) {
    next(e)
  }
}
const getById = async (req, res, next) => {
  try {
    const {id} = req.params
    const blog = await Blog.findById(id)
    if (!blog) {
      throw new Error('Not found')
    }
    return res.json(blog)
  } catch (e) {
    next(e)
  }
}
const updateById = async (req, res, next) => {
  try {
    const {id} = req.params
    const {title, author, url, likes} = req.body
    const updateData = {title, author, url, likes}
    const blog = await Blog.findByIdAndUpdate(id, updateData, {new: true, runValidators: true})
    if (!blog) {
      throw new Error('Not found')
    }
    return res.json(blog)
  } catch (e) {
    next(e)
  }
}
const likeBlogById = async (req, res, next) => {
  try {
    const {id} = req.params
    const blog = await Blog.findById(id)
    if (!blog) {
      throw new Error('Not found')
    }
    blog.likes = blog.likes + 1
    blog.save()
    return res.json(blog)
  } catch (e) {
    next(e)
  }
}
const addNewCommentById = async (req, res, next) => {
  try {
    const {id} = req.params
    const {comment} = req.body
    const blog = await Blog.findById(id)
    if (!blog) {
      throw new Error('Not found')
    }
    blog.comments = [...blog.comments, comment]
    blog.save()
    return res.json(blog)
  } catch (e) {
    next(e)
  }
}



module.exports = {
  getAll,
  create,
  deleteById,
  updateById,
  getById,
  likeBlogById,
  addNewCommentById
}