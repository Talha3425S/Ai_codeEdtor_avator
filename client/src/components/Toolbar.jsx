import { Bot, Code2, ShieldCheck, Sparkles, Wand2 } from 'lucide-react'

const tools = [
  { id: 'explain', label: 'Explain', icon: Bot },
  { id: 'fix', label: 'Fix', icon: Wand2 },
  { id: 'generate', label: 'Generate', icon: Sparkles },
  { id: 'scan', label: 'Scan Security', icon: ShieldCheck },
]

function Toolbar({ onAction, loading }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Actions</h2>
        <Code2 size={17} aria-hidden="true" />
      </div>
      <div className="toolbar">
        {tools.map(({ id, label, icon: Icon }) => (
          <button
            className="tool-button"
            type="button"
            key={id}
            onClick={() => onAction(id)}
            disabled={loading}
            title={label}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
      </div>
    </section>
  )
}

export default Toolbar

