const express = require('express')
const router = express.Router()
const {getAll, create, deleteById, getById, updateById} = require('../controllers/blogs')
const {authenticate, isOwnBlog} = require('../controllers/auth')
router.route('/blogs')
  .get(getAll)
  .post(authenticate, create)

router.route('/blogs/:id')
  .get(getById)
  .put(isOwnBlog, updateById)
  .delete(isOwnBlog, deleteById)

module.exports = router