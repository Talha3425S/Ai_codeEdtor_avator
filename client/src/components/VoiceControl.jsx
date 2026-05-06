import { useRef, useState } from 'react'
import { Mic, Square } from 'lucide-react'

function VoiceControl({ onCommand, onInsert, loading }) {
  const recognitionRef = useRef(null)
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition
  const isSupported = Boolean(SpeechRecognition)

  const handleTranscript = (text) => {
    const cleanText = text.trim()
    const command = cleanText.toLowerCase()
    setTranscript(cleanText)

    if (command.includes('scan')) {
      onCommand('scan')
      return
    }

    if (command.includes('explain')) {
      onCommand('explain')
      return
    }

    if (command.includes('fix')) {
      onCommand('fix')
      return
    }

    if (command.includes('generate')) {
      onCommand('generate')
      return
    }

    onInsert(cleanText)
  }

  const startListening = () => {
    if (!isSupported || loading) return

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript
      handleTranscript(text)
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setListening(false)
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Voice</h2>
      </div>
      <div className="voice-body">
        <div className="voice-actions">
          <button
            className="tool-button"
            type="button"
            onClick={listening ? stopListening : startListening}
            disabled={!isSupported || loading}
            title={listening ? 'Stop listening' : 'Start listening'}
          >
            {listening ? <Square size={17} /> : <Mic size={17} />}
            {listening ? 'Stop' : 'Listen'}
          </button>
        </div>
        <p className="voice-status">
          {isSupported ? transcript || 'No transcript yet.' : 'Voice not supported.'}
        </p>
      </div>
    </section>
  )
}

export default VoiceControl

