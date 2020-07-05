const express = require('express')
const router = express.Router()
const {getAll, create, getById} = require('../controllers/users')
//
router.route('/users')
  .get(getAll)
  .post(create)

router.route('/users/:id')
  .get(getById)

module.exports = router