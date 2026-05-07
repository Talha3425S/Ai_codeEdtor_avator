const axios = require('axios')
const { buildPrompt } = require('../utils/prompts')

const fallbackResponses = {
  explain:
    'This code builds a SQL query by joining user input directly into the string. That is dangerous because an attacker can change the query behavior.',
  review:
    'Review: the main issue is unsafe user input in the SQL query. Add input validation, use prepared statements, and avoid logging sensitive query data.',
  fix:
    'Use parameterized queries instead of string concatenation. Example: db.query("SELECT * FROM users WHERE id = ?", [userId]);',
  optimize:
    'Optimization idea: keep database access in a small helper function, validate the user id once, and reuse a parameterized query.',
  generate:
    'Example safe helper:\n\nfunction getUserById(db, userId) {\n  return db.query("SELECT * FROM users WHERE id = ?", [userId]);\n}',
  document:
    'Documentation comment:\n\n// Fetch a user by id using a parameterized query to avoid SQL injection.',
}

function getAiConfig() {
  const apiKey = (process.env.AI_API_KEY || '').trim()
  const model = process.env.AI_MODEL || 'gpt-4o-mini'
  const apiUrl =
    process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions'

  return { apiKey, model, apiUrl }
}

function getPublicAiError(error) {
  const statusCode = error.response?.status || 502
  const apiMessage =
    error.response?.data?.error?.message ||
    error.response?.data?.message ||
    error.message ||
    'AI request failed.'

  if (statusCode === 401) {
    return {
      statusCode,
      message:
        'AI key is invalid or expired. Create a new key and update server/.env.',
      details: apiMessage,
    }
  }

  if (statusCode === 429) {
    return {
      statusCode,
      message:
        'AI key is valid, but billing, quota, or rate limit is blocking requests.',
      details: apiMessage,
    }
  }

  if (statusCode === 404) {
    return {
      statusCode,
      message: 'AI model was not found or is not enabled for this account.',
      details: apiMessage,
    }
  }

  return {
    statusCode,
    message: 'AI request failed. Check backend terminal for details.',
    details: apiMessage,
  }
}

async function checkAiConnection() {
  const { apiKey, model, apiUrl } = getAiConfig()

  if (!apiKey) {
    return {
      ok: false,
      state: 'demo',
      model,
      message: 'AI_API_KEY is missing. The app is running in demo mode.',
    }
  }

  try {
    const response = await axios.post(
      apiUrl,
      {
        model,
        messages: [
          {
            role: 'system',
            content: 'You are a health check endpoint.',
          },
          {
            role: 'user',
            content: 'Reply with exactly: API_OK',
          },
        ],
        temperature: 0,
        max_tokens: 8,
      },
      {
        headers: {
          Authorization: 'Bearer ' + apiKey,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      },
    )

    const sample =
      response.data?.choices?.[0]?.message?.content?.trim() || 'No text returned'

    return {
      ok: true,
      state: 'working',
      model,
      message: 'AI API is working.',
      sample,
    }
  } catch (error) {
    const publicError = getPublicAiError(error)

    return {
      ok: false,
      state: 'error',
      model,
      message: publicError.message,
      statusCode: publicError.statusCode,
      details: publicError.details,
    }
  }
}

async function runAiTask(task, code) {
  const { apiKey, model, apiUrl } = getAiConfig()

  if (!apiKey) {
    return (
      fallbackResponses[task] +
      '\n\nDemo mode: add AI_API_KEY in server/.env to enable live AI responses.'
    )
  }

  try {
    const response = await axios.post(
      apiUrl,
      {
        model,
        messages: [
          {
            role: 'system',
            content:
              'You are a concise coding assistant. Give practical, beginner-friendly answers.',
          },
          {
            role: 'user',
            content: buildPrompt(task, code),
          },
        ],
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: 'Bearer ' + apiKey,
          'Content-Type': 'application/json',
        },
      },
    )

    return (
      response.data?.choices?.[0]?.message?.content?.trim() ||
      'No AI response returned.'
    )
  } catch (error) {
    const publicError = getPublicAiError(error)
    const wrappedError = new Error(publicError.message)
    wrappedError.publicMessage = publicError.message
    wrappedError.statusCode = publicError.statusCode
    wrappedError.details = publicError.details
    throw wrappedError
  }
}

module.exports = { checkAiConnection, runAiTask }
