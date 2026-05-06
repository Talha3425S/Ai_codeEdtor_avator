const taskInstructions = {
  explain: 'Explain what this code does and mention any obvious risks.',
  review:
    'Review this code like a senior developer. Return bugs, security risks, and maintainability improvements in short bullets.',
  fix: 'Fix this code and briefly explain the changes.',
  optimize:
    'Suggest a cleaner and more efficient version of this code. Keep the explanation beginner-friendly.',
  generate:
    'Generate a cleaner or safer version of this code while keeping the same goal.',
  document:
    'Add useful comments or documentation for this code without over-commenting obvious lines.',
}

function buildPrompt(task, code) {
  return `${taskInstructions[task] || taskInstructions.explain}

Code:
\`\`\`
${code}
\`\`\``
}

module.exports = { buildPrompt }
