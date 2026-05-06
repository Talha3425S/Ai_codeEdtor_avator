import { Volume2 } from 'lucide-react'

function Avatar({ text }) {
  const canSpeak = Boolean(text) && 'speechSynthesis' in window

  const speak = () => {
    if (!canSpeak) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.95
    utterance.pitch = 1
    window.speechSynthesis.speak(utterance)
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Avatar</h2>
      </div>
      <div className="avatar-body">
        <div className="avatar-face" aria-hidden="true">
          AI
        </div>
        <div className="avatar-copy">
          <strong>Ready</strong>
          <p>{text ? 'Latest result loaded' : 'Waiting for output'}</p>
        </div>
        <button
          className="speak-button"
          type="button"
          onClick={speak}
          disabled={!canSpeak}
          title="Read output aloud"
        >
          <Volume2 size={16} />
          Speak
        </button>
      </div>
    </section>
  )
}

export default Avatar

