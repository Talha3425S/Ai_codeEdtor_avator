const severityClass = {
  Critical: 'critical',
  High: 'high',
  Medium: 'medium',
  Low: 'low',
}

function OutputPanel({ status, result, error, findings = [], loading }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Output</h2>
        {loading ? <span className="mini-pill">Running</span> : null}
      </div>
      <div className="output-body">
        <p className="output-status">{status}</p>
        <pre className={`output-text ${error ? 'error' : ''}`}>
          {error || result || 'No result yet.'}
        </pre>
        {findings.length ? (
          <div className="findings-list">
            {findings.map((finding) => (
              <article className="finding-card" key={finding.id}>
                <div className="finding-head">
                  <span
                    className={`severity ${severityClass[finding.severity] || 'low'}`}
                  >
                    {finding.severity}
                  </span>
                  <strong>{finding.message}</strong>
                </div>
                <p>
                  <strong>Why:</strong> {finding.reason}
                </p>
                <p>
                  <strong>Solution:</strong> {finding.fix}
                </p>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default OutputPanel
