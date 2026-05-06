const express = require('express')
const {
  explainCode,
  fixCode,
  generateCode,
} = require('../controllers/aiController')

const router = express.Router()

router.post('/explain', explainCode)
router.post('/fix', fixCode)
router.post('/generate', generateCode)

module.exports = router

