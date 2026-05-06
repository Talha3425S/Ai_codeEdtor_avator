const checks = [
  {
    id: 'sql-injection',
    severity: 'High',
    test: (code) =>
      /select\s+[\s\S]*\+|where\s+[\s\S]*\+|query\s*\([^)]*\+/i.test(code),
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
    test: (code) =>
      /innerHTML\s*=|outerHTML\s*=|insertAdjacentHTML|dangerouslySetInnerHTML/i.test(
        code,
      ),
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
    severity: 'High',
    test: (code) =>
      /find(One)?\s*\(\s*req\.(body|query|params)|\$where\s*:/i.test(code),
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
  {
    id: 'path-traversal',
    severity: 'High',
    test: (code) =>
      /(readFile|writeFile|createReadStream|sendFile)\s*\([^)]*req\.(body|query|params)|\.\.\//i.test(
        code,
      ),
    message: 'Possible path traversal risk detected.',
    fix: 'Normalize paths and restrict file access to an allowed directory.',
  },
  {
    id: 'open-redirect',
    severity: 'Medium',
    test: (code) =>
      /(redirect|location\.href|window\.location)\s*\([^)]*req\.(body|query|params)|location\.href\s*=\s*req\./i.test(
        code,
      ),
    message: 'Possible open redirect detected.',
    fix: 'Redirect only to trusted internal paths or validated URLs.',
  },
  {
    id: 'insecure-http',
    severity: 'Low',
    test: (code) => /http:\/\/(?!localhost|127\.0\.0\.1)/i.test(code),
    message: 'Insecure HTTP URL detected.',
    fix: 'Use HTTPS for external network requests.',
  },
  {
    id: 'weak-hashing',
    severity: 'Medium',
    test: (code) => /createHash\s*\(\s*["'](md5|sha1)["']\s*\)/i.test(code),
    message: 'Weak hashing algorithm detected.',
    fix: 'Use a modern password hashing algorithm such as bcrypt or argon2.',
  },
  {
    id: 'sensitive-logging',
    severity: 'Low',
    test: (code) =>
      /console\.log\s*\([^)]*(password|token|secret|api[_-]?key)/i.test(code),
    message: 'Possible sensitive data logging detected.',
    fix: 'Avoid logging secrets, tokens, passwords, or API keys.',
  },
  {
    id: 'cors-wildcard',
    severity: 'Medium',
    test: (code) => /origin\s*:\s*["']\*["']|Access-Control-Allow-Origin["']?\s*,\s*["']\*["']/i.test(code),
    message: 'Permissive CORS configuration detected.',
    fix: 'Allow only trusted frontend origins.',
  },
]

const severityWeight = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
}

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

  const sortedFindings = [...findings].sort(
    (first, second) =>
      severityWeight[second.severity] - severityWeight[first.severity],
  )
  const counts = sortedFindings.reduce((summary, finding) => {
    summary[finding.severity] = (summary[finding.severity] || 0) + 1
    return summary
  }, {})
  const headline = Object.entries(counts)
    .map(([severity, count]) => `${count} ${severity}`)
    .join(', ')

  return {
    findings: sortedFindings,
    summary: `Security scan found ${sortedFindings.length} issue(s): ${headline}.\n\n${sortedFindings
      .map(
        (finding) =>
          `[${finding.severity}] ${finding.message}\nFix: ${finding.fix}`,
      )
      .join('\n\n')}`,
  }
}

module.exports = { scanCode }
