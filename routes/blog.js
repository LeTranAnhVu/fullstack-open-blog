const express = require('express')
const router = express.Router()
const {getAll, create, deleteById, getById, updateById} = require('../controllers/blogs')
const {authenticate} = require('../controllers/auth')
router.route('/blogs')
  .get(getAll)
  .post(authenticate, create)

router.route('/blogs/:id')
  .get(getById)
  .put(updateById)
  .delete(deleteById)

module.exports = router