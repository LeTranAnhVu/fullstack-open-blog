const express = require('express')
const router = express.Router()
const {getAll, create} = require('../controllers/users')
//
router.route('/users')
  .get(getAll)
  .post(create)

// router.route('/users/:id')
//   .get(getById)
//   .put(updateById)
//   .delete(deleteById)

module.exports = router