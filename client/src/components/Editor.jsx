import MonacoEditor from '@monaco-editor/react'

function Editor({ code, onChange }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Code Editor</h2>
        <span className="language-tag">JavaScript</span>
      </div>
      <div className="editor-frame">
        <MonacoEditor
          height="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={code}
          onChange={(value) => onChange(value ?? '')}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
          }}
        />
      </div>
    </section>
  )
}

export default Editor

