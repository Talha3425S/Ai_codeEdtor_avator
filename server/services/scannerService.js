const checks = [
  {
    id: 'sql-injection',
    severity: 'High',
    test: (code) => /select\s+[\s\S]*\+|where\s+[\s\S]*\+/i.test(code),
    message: 'Possible SQL injection detected.',
    fix: 'Use parameterized queries or prepared statements.',
  },
  {
    id: 'eval-usage',
    severity: 'High',
    test: (code) => /\beval\s*\(/i.test(code),
    message: 'Use of eval detected.',
    fix: 'Avoid eval because it can execute attacker-controlled code.',
  },
  {
    id: 'hardcoded-secret',
    severity: 'Medium',
    test: (code) =>
      /(api[_-]?key|password|secret|token)\s*=\s*["'][^"']+["']/i.test(code),
    message: 'Possible hardcoded secret detected.',
    fix: 'Move secrets to environment variables.',
  },
  {
    id: 'unsafe-html',
    severity: 'Medium',
    test: (code) => /innerHTML\s*=|dangerouslySetInnerHTML/i.test(code),
    message: 'Unsafe HTML rendering pattern detected.',
    fix: 'Sanitize input or render text content safely.',
  },
]

function scanCode(code) {
  const findings = checks
    .filter((check) => check.test(code))
    .map(({ id, severity, message, fix }) => ({
      id,
      severity,
      message,
      fix,
    }))

  if (!findings.length) {
    return {
      findings,
      summary: 'No common beginner-level security warnings were detected.',
    }
  }

  return {
    findings,
    summary: findings
      .map(
        (finding) =>
          `[${finding.severity}] ${finding.message}\nFix: ${finding.fix}`,
      )
      .join('\n\n'),
  }
}

module.exports = { scanCode }

