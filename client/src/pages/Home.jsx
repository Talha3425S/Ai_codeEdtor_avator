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
  scanSecurity,
} from '../services/api'

const starterCode = `const userId = req.query.id;
const query = "SELECT * FROM users WHERE id = " + userId;

console.log(query);`

const actionMap = {
  explain: explainCode,
  fix: fixCode,
  generate: generateCode,
  scan: scanSecurity,
}

function Home() {
  const [code, setCode] = useState(starterCode)
  const [status, setStatus] = useState('Idle')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const runAction = async (action) => {
    setLoading(true)
    setError('')
    setStatus('Processing')

    try {
      const response = await actionMap[action](code)
      setResult(response.result)
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
    setCode((currentCode) => `${currentCode}\n\n// Voice note: ${text}`)
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

      <div className="workspace">
        <Editor code={code} onChange={setCode} />
        <aside className="side-column">
          <Toolbar onAction={runAction} loading={loading} />
          <VoiceControl
            onCommand={runAction}
            onInsert={insertVoiceText}
            loading={loading}
          />
          <OutputPanel status={status} result={result} error={error} />
          <Avatar text={error || result} />
        </aside>
      </div>
    </main>
  )
}

export default Home
