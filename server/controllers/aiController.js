const { runAiTask } = require('../services/aiService')

const handleAiRequest = (task) => async (req, res, next) => {
  try {
    const { code } = req.body

    if (!code || !code.trim()) {
      return res.status(400).json({ error: 'Code is required.' })
    }

    const result = await runAiTask(task, code)
    return res.json({ status: 'Done', result })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  explainCode: handleAiRequest('explain'),
  fixCode: handleAiRequest('fix'),
  generateCode: handleAiRequest('generate'),
}

