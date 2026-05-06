const axios = require('axios')
const { buildPrompt } = require('../utils/prompts')

const fallbackResponses = {
  explain:
    'This code builds a SQL query by joining user input directly into the string. That is dangerous because an attacker can change the query behavior.',
  fix:
    'Use parameterized queries instead of string concatenation. Example: db.query("SELECT * FROM users WHERE id = ?", [userId]);',
  generate:
    'Example safe helper:\n\nfunction getUserById(db, userId) {\n  return db.query("SELECT * FROM users WHERE id = ?", [userId]);\n}',
}

async function runAiTask(task, code) {
  if (!process.env.AI_API_KEY) {
    return `${fallbackResponses[task]}\n\nDemo mode: add AI_API_KEY in server/.env to enable live AI responses.`
  }

  const response = await axios.post(
    process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions',
    {
      model: process.env.AI_MODEL || 'gpt-4o-mini',
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
        Authorization: `Bearer ${process.env.AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    },
  )

  return (
    response.data?.choices?.[0]?.message?.content?.trim() ||
    'No AI response returned.'
  )
}

module.exports = { runAiTask }

