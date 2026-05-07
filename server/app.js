require('dotenv').config()

const cors = require('cors')
const express = require('express')
const aiRoutes = require('./routes/aiRoutes')
const securityRoutes = require('./routes/securityRoutes')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'AI Code Editor API is running' })
})

app.use('/api/ai', aiRoutes)
app.use('/api/security', securityRoutes)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(err.statusCode || 500).json({
    error: err.publicMessage || 'Server error. Please try again.',
    details: err.details,
  })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

