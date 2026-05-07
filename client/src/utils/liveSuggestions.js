const liveRules = [
  {
    id: 'sql-concat',
    severity: 'High',
    test: (code) => /select\s+[\s\S]*\+|where\s+[\s\S]*\+/i.test(code),
    title: 'SQL injection risk',
    message:
      'I see a SQL query being joined with input. Use a parameterized query so user input cannot change the SQL command.',
    solution: 'Example: db.query("SELECT * FROM users WHERE id = ?", [userId]);',
  },
  {
    id: 'eval',
    severity: 'High',
    test: (code) => /\beval\s*\(/i.test(code),
    title: 'Unsafe eval usage',
    message:
      'eval can execute text as code. If that text comes from a user, it can become a serious security bug.',
    solution: 'Avoid eval and use explicit parsing or a safe function map.',
  },
  {
    id: 'inner-html',
    severity: 'Medium',
    test: (code) => /innerHTML\s*=|outerHTML\s*=|dangerouslySetInnerHTML/i.test(code),
    title: 'Unsafe HTML rendering',
    message:
      'Direct HTML insertion can create XSS bugs if the content includes user input.',
    solution: 'Use textContent or sanitize HTML before rendering it.',
  },
  {
    id: 'hardcoded-secret',
    severity: 'Medium',
    test: (code) => /(api[_-]?key|password|secret|token)\s*=\s*["'][^"']+["']/i.test(code),
    title: 'Hardcoded secret',
    message:
      'A password, token, secret, or API key appears to be written inside the code.',
    solution: 'Move secrets into environment variables and never commit them.',
  },
  {
    id: 'console-log-secret',
    severity: 'Low',
    test: (code) => /console\.log\s*\([^)]*(password|token|secret|api[_-]?key)/i.test(code),
    title: 'Sensitive logging',
    message:
      'This looks like it may print a secret value into logs.',
    solution: 'Remove the log or mask sensitive values before printing.',
  },
  {
    id: 'weak-random',
    severity: 'Low',
    test: (code) => /Math\.random\s*\(\)[\s\S]*(token|secret|password|otp)/i.test(code),
    title: 'Weak random token',
    message:
      'Math.random is not safe for security tokens or OTP values.',
    solution: 'Use crypto.randomUUID or a cryptographic random generator.',
  },
]

export function getLiveSuggestions(code) {
  const trimmedCode = code.trim()

  if (!trimmedCode) {
    return [
      {
        id: 'empty-editor',
        severity: 'Info',
        title: 'Start typing',
        message: 'I am connected to the editor. As you type, I will watch for risks and suggestions here.',
        solution: 'Write or paste JavaScript code into the editor.',
      },
    ]
  }

  const matched = liveRules.filter((rule) => rule.test(code))

  if (matched.length) {
    return matched
  }

  if (!/try\s*\{|catch\s*\(/.test(code) && /await|fetch\s*\(|axios\./.test(code)) {
    return [
      {
        id: 'async-error-handling',
        severity: 'Info',
        title: 'Add error handling',
        message:
          'I see async or network-style code. Consider wrapping it in try/catch so failures are handled cleanly.',
        solution: 'Use try/catch and show a helpful error message to the user.',
      },
    ]
  }

  if (code.split('\n').length > 25) {
    return [
      {
        id: 'large-function',
        severity: 'Info',
        title: 'Keep code readable',
        message:
          'This code is getting longer. Consider splitting it into smaller functions before it becomes hard to test.',
        solution: 'Extract repeated logic into helper functions with clear names.',
      },
    ]
  }

  return [
    {
      id: 'looks-good',
      severity: 'Good',
      title: 'No quick warning found',
      message:
        'I am checking your code live. I do not see a common beginner-level security issue in this version.',
      solution: 'For deeper feedback, click Review or Scan Security.',
    },
  ]
}

export function getAvatarSuggestionText(suggestions) {
  const primary = suggestions[0]

  if (!primary) {
    return 'I am connected to the editor and ready to help.'
  }

  return `${primary.title}: ${primary.message} Solution: ${primary.solution}`
}
