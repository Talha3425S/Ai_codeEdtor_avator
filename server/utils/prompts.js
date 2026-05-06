const taskInstructions = {
  explain: 'Explain what this code does and mention any obvious risks.',
  fix: 'Fix this code and briefly explain the changes.',
  generate:
    'Generate a cleaner or safer version of this code while keeping the same goal.',
}

function buildPrompt(task, code) {
  return `${taskInstructions[task] || taskInstructions.explain}

Code:
\`\`\`
${code}
\`\`\``
}

module.exports = { buildPrompt }

