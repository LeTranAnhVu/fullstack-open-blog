const express = require('express')
const router = express.Router()
const {getAll, create} = require('../controllers/blogs')

router.route('/blogs')
  .get(getAll)
  .post(create)

module.exports = router