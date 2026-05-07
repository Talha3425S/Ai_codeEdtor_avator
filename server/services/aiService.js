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
  const provider = (process.env.AI_PROVIDER || 'gemini').trim().toLowerCase()
  const apiKey = (process.env.AI_API_KEY || '').trim()
  const model =
    process.env.AI_MODEL ||
    (provider === 'gemini' ? 'gemini-2.5-flash-lite' : 'gpt-4o-mini')
  const apiUrl = process.env.AI_API_URL || getDefaultApiUrl(provider, model)

  return { provider, apiKey, model, apiUrl }
}

function getDefaultApiUrl(provider, model) {
  if (provider === 'gemini') {
    return 'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent'
  }

  return 'https://api.openai.com/v1/chat/completions'
}

function getPublicAiError(error) {
  const statusCode = error.response?.status || 502
  const apiMessage =
    error.response?.data?.error?.message ||
    error.response?.data?.message ||
    error.message ||
    'AI request failed.'

  if (statusCode === 400) {
    return {
      statusCode,
      message: 'AI request format or model setting is invalid. Check AI_PROVIDER and AI_MODEL in server/.env.',
      details: apiMessage,
    }
  }

  if (statusCode === 401 || statusCode === 403) {
    return {
      statusCode,
      message:
        'AI key is invalid, blocked, or not allowed for this provider. Create a new key and update server/.env.',
      details: apiMessage,
    }
  }

  if (statusCode === 429) {
    return {
      statusCode,
      message:
        'AI key is valid, but quota or rate limit is blocking requests.',
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
  const { provider, apiKey, model, apiUrl } = getAiConfig()

  if (!apiKey) {
    return (
      fallbackResponses[task] +
      '\n\nDemo mode: add AI_API_KEY in server/.env to enable live AI responses.'
    )
  }

  try {
    const sample = await callAi({
      provider,
      apiKey,
      apiUrl,
      model,
      systemPrompt: 'You are a health check endpoint.',
      userPrompt: 'Reply with exactly: API_OK',
      temperature: 0,
      maxOutputTokens: 8,
    })

    return {
      ok: true,
      state: 'working',
      provider,
      model,
      message: 'AI API is working.',
      sample,
    }
  } catch (error) {
    const publicError = getPublicAiError(error)

    return {
      ok: false,
      state: 'error',
      provider,
      model,
      message: publicError.message,
      statusCode: publicError.statusCode,
      details: publicError.details,
    }
  }
}

async function runAiTask(task, code) {
  const { provider, apiKey, model, apiUrl } = getAiConfig()

  if (!apiKey) {
    return (
      fallbackResponses[task] +
      '\n\nDemo mode: add AI_API_KEY in server/.env to enable live AI responses.'
    )
  }

  try {
    return await callAi({
      provider,
      apiKey,
      apiUrl,
      model,
      systemPrompt:
        'You are a concise coding assistant. Give practical, beginner-friendly answers.',
      userPrompt: buildPrompt(task, code),
      temperature: 0.2,
      maxOutputTokens: 700,
    })
  } catch (error) {
    const publicError = getPublicAiError(error)
    const wrappedError = new Error(publicError.message)
    wrappedError.publicMessage = publicError.message
    wrappedError.statusCode = publicError.statusCode
    wrappedError.details = publicError.details
    throw wrappedError
  }
}

async function callAi({
  provider,
  apiKey,
  apiUrl,
  model,
  systemPrompt,
  userPrompt,
  temperature,
  maxOutputTokens,
}) {
  if (provider === 'gemini') {
    const response = await axios.post(
      apiUrl,
      {
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: userPrompt }],
          },
        ],
        generationConfig: {
          temperature,
          maxOutputTokens,
        },
      },
      {
        headers: {
          'x-goog-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      },
    )

    return extractGeminiText(response.data)
  }

  const response = await axios.post(
    apiUrl,
    {
      model,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature,
      max_tokens: maxOutputTokens,
    },
    {
      headers: {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    },
  )

  return (
    response.data?.choices?.[0]?.message?.content?.trim() ||
    'No AI response returned.'
  )
}

function extractGeminiText(data) {
  const text = data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || '')
    .join('')
    .trim()

  return text || 'No AI response returned.'
}

module.exports = { checkAiConnection, runAiTask }
