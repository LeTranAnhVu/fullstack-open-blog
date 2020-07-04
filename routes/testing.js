const express = require('express')
const router = express.Router()
const {testingReset} = require('../controllers/testing')
//
router.post('/testing/reset', testingReset)

module.exports = router