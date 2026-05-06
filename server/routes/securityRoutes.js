const express = require('express')
const { scanSecurity } = require('../controllers/securityController')

const router = express.Router()

router.post('/scan', scanSecurity)

module.exports = router

