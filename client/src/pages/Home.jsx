import { useState } from 'react'
import Avatar from '../components/Avatar'
import Editor from '../components/Editor'
import OutputPanel from '../components/OutputPanel'
import Toolbar from '../components/Toolbar'
import VoiceControl from '../components/VoiceControl'
import {
  explainCode,
  fixCode,
  generateCode,
  documentCode,
  optimizeCode,
  reviewCode,
  scanSecurity,
} from '../services/api'

const starterCode = `const userId = req.query.id;
const query = "SELECT * FROM users WHERE id = " + userId;

console.log(query);`

const actionMap = {
  explain: explainCode,
  review: reviewCode,
  fix: fixCode,
  optimize: optimizeCode,
  generate: generateCode,
  document: documentCode,
  scan: scanSecurity,
}

const actionLabels = {
  explain: 'Explaining code',
  review: 'Reviewing code',
  fix: 'Fixing code',
  optimize: 'Optimizing code',
  generate: 'Generating code',
  document: 'Documenting code',
  scan: 'Scanning security',
}

function Home() {
  const [code, setCode] = useState(starterCode)
  const [status, setStatus] = useState('Idle')
  const [result, setResult] = useState('')
  const [findings, setFindings] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const lineCount = code.split('\n').length

  const runAction = async (action) => {
    setLoading(true)
    setError('')
    setFindings([])
    setStatus(actionLabels[action] || 'Processing')

    try {
      const response = await actionMap[action](code)
      setResult(response.result)
      setFindings(response.findings || [])
      setStatus(response.status || 'Done')
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          'Request failed. Make sure the backend server is running.',
      )
      setStatus('Error')
    } finally {
      setLoading(false)
    }
  }

  const insertVoiceText = (text) => {
    setCode((currentCode) => currentCode + '\n\n// Voice note: ' + text)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">AI</div>
          <div>
            <h1>AI Code Editor Avatar</h1>
            <p>Developer assistant workspace</p>
          </div>
        </div>
        <span className="server-pill">API: localhost:5000</span>
      </header>

      <section className="meta-strip" aria-label="Workspace status">
        <div>
          <strong>{lineCount}</strong>
          <span>Lines</span>
        </div>
        <div>
          <strong>{code.length}</strong>
          <span>Characters</span>
        </div>
        <div>
          <strong>{findings.length}</strong>
          <span>Findings</span>
        </div>
        <div>
          <strong>{loading ? 'Busy' : 'Ready'}</strong>
          <span>Status</span>
        </div>
      </section>

      <div className="workspace">
        <Editor code={code} onChange={setCode} />
        <aside className="side-column">
          <Toolbar onAction={runAction} loading={loading} />
          <Avatar text={error || result} />
          <VoiceControl
            onCommand={runAction}
            onInsert={insertVoiceText}
            loading={loading}
          />
          <OutputPanel
            status={status}
            result={result}
            error={error}
            findings={findings}
            loading={loading}
          />
        </aside>
      </div>
    </main>
  )
}

export default Home
