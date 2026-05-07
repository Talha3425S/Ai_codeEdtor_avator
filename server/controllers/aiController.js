const { checkAiConnection, runAiTask } = require('../services/aiService')

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
  checkAiStatus: async (_req, res, next) => {
    try {
      const status = await checkAiConnection()
      return res.json(status)
    } catch (error) {
      return next(error)
    }
  },
  explainCode: handleAiRequest('explain'),
  reviewCode: handleAiRequest('review'),
  fixCode: handleAiRequest('fix'),
  optimizeCode: handleAiRequest('optimize'),
  generateCode: handleAiRequest('generate'),
  documentCode: handleAiRequest('document'),
}
