function OutputPanel({ status, result, error }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Output</h2>
      </div>
      <div className="output-body">
        <p className="output-status">{status}</p>
        <pre className={`output-text ${error ? 'error' : ''}`}>
          {error || result || 'No result yet.'}
        </pre>
      </div>
    </section>
  )
}

export default OutputPanel

