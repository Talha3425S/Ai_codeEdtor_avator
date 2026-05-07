const express = require('express')
const {
  explainCode,
  fixCode,
  generateCode,
  documentCode,
  optimizeCode,
  reviewCode,
  checkAiStatus,
} = require('../controllers/aiController')

const router = express.Router()

router.get('/status', checkAiStatus)
router.post('/explain', explainCode)
router.post('/review', reviewCode)
router.post('/fix', fixCode)
router.post('/optimize', optimizeCode)
router.post('/generate', generateCode)
router.post('/document', documentCode)

module.exports = router
