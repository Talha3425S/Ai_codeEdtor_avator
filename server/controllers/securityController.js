const { scanCode } = require('../services/scannerService')

function scanSecurity(req, res) {
  const { code } = req.body

  if (!code || !code.trim()) {
    return res.status(400).json({ error: 'Code is required.' })
  }

  const report = scanCode(code)
  return res.json({
    status: report.findings.length ? 'Warnings found' : 'No warnings',
    result: report.summary,
    findings: report.findings,
  })
}

module.exports = { scanSecurity }

