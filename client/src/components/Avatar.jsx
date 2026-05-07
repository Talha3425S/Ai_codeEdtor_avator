import { useCallback, useEffect, useState } from 'react'
import { Square, Volume2 } from 'lucide-react'
import ThreeAvatarScene from './ThreeAvatarScene'

function Avatar({ text, liveText, suggestions = [] }) {
  const [autoSpeak, setAutoSpeak] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const speakText = text || liveText || ''
  const canSpeak = Boolean(speakText) && 'speechSynthesis' in window
  const hasOutput = Boolean(text)
  const primarySuggestion = suggestions[0]

  const speak = useCallback(() => {
    if (!canSpeak) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(speakText)
    utterance.rate = 0.95
    utterance.pitch = 1
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }, [canSpeak, speakText])

  const stop = () => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }

  useEffect(() => {
    if (autoSpeak && hasOutput && canSpeak) {
      speak()
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [autoSpeak, canSpeak, hasOutput, speak])

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Avatar</h2>
        <div className="avatar-header-tools">
          <span className="connection-pill">Editor connected</span>
          <label className="toggle-row">
            <input
              type="checkbox"
              checked={autoSpeak}
              onChange={(event) => setAutoSpeak(event.target.checked)}
            />
            Auto
          </label>
        </div>
      </div>
      <div className="avatar-body">
        <ThreeAvatarScene speaking={speaking} />
        <div className="avatar-speech-box">
          <span className="avatar-speech-label">
            {hasOutput ? 'Avatar explains result' : 'Avatar live suggestion'}
          </span>
          <p>{speakText || 'I am watching the editor. Start typing code.'}</p>
        </div>
        <div className="avatar-controls">
          <div className="avatar-copy">
            <strong>
              {speaking
                ? 'Speaking'
                : primarySuggestion
                  ? primarySuggestion.title
                  : 'Ready'}
            </strong>
            <p>
              {hasOutput
                ? 'Latest result loaded'
                : 'Checking the editor as you type'}
            </p>
          </div>
          <button
            className="speak-button"
            type="button"
            onClick={speaking ? stop : speak}
            disabled={!canSpeak}
            title={speaking ? 'Stop reading' : 'Read avatar text aloud'}
          >
            {speaking ? <Square size={16} /> : <Volume2 size={16} />}
            {speaking ? 'Stop' : 'Speak'}
          </button>
        </div>
        {suggestions.length ? (
          <div className="avatar-suggestion-list" aria-label="Live avatar suggestions">
            {suggestions.slice(0, 3).map((suggestion) => (
              <div className="avatar-suggestion" key={suggestion.id}>
                <span className={`suggestion-dot ${suggestion.severity.toLowerCase()}`} />
                <div>
                  <strong>{suggestion.title}</strong>
                  <p>{suggestion.solution}</p>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default Avatar
