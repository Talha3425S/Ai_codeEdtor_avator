require('dotenv').config()

const cors = require('cors')
const express = require('express')
const aiRoutes = require('./routes/aiRoutes')
const securityRoutes = require('./routes/securityRoutes')
const { checkAiConnection } = require('./services/aiService')

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

async function logAiStartupStatus() {
  const status = await checkAiConnection()
  const label = status.ok ? 'AI API working' : 'AI API issue'

  console.log('----------------------------------------')
  console.log(label)
  console.log('Provider:', status.provider || 'not set')
  console.log('Model:', status.model || 'not set')
  console.log('Message:', status.message)

  if (status.statusCode) {
    console.log('Status code:', status.statusCode)
  }

  if (status.details) {
    console.log('Details:', status.details)
  }

  if (status.sample) {
    console.log('Sample:', status.sample)
  }

  console.log('----------------------------------------')
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  logAiStartupStatus().catch((error) => {
    console.log('AI API issue')
    console.log(error.message)
  })
})
