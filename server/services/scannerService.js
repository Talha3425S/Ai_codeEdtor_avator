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
  {
    id: 'command-injection',
    severity: 'High',
    test: (code) =>
      /(exec|execSync|spawn)\s*\([^)]*\+|child_process/i.test(code),
    message: 'Possible command execution risk detected.',
    fix: 'Avoid passing user input into shell commands.',
  },
  {
    id: 'nosql-injection',
    severity: 'Medium',
    test: (code) => /find(One)?\s*\(\s*req\.(body|query|params)/i.test(code),
    message: 'Possible NoSQL injection pattern detected.',
    fix: 'Validate and whitelist request fields before database queries.',
  },
  {
    id: 'weak-random-token',
    severity: 'Low',
    test: (code) => /Math\.random\s*\(\)[\s\S]*(token|secret|password|otp)/i.test(code),
    message: 'Weak random value used for sensitive data.',
    fix: 'Use a cryptographic random generator for secrets and tokens.',
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
