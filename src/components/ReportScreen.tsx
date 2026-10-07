import { getMedicinesFor, getPrescriptions } from '../lib/storage'
import { checkInteractions, getDrugInfo } from '../lib/drugInfo'

export default function ReportScreen({ id, onBack }: { id: number; onBack: () => void }) {
  const prescription = getPrescriptions().find((p) => p.id === id)
  if (!prescription) return <p>Prescription not found.</p>

  const medicines = getMedicinesFor(id)
  const interactions = checkInteractions(medicines.map((m) => m.name))

  return (
    <section className="report">
      <div className="actions-inline">
        <button className="small" onClick={onBack}>← Back</button>
        <button className="small" onClick={() => window.print()}>🖨 Print</button>
      </div>
      <h2>Prescription report</h2>
      <p className="muted">{new Date(prescription.processedDate).toLocaleString()}</p>

      <h3>Medicines ({medicines.length})</h3>
      <table className="report-table">
        <thead>
          <tr><th>Name</th><th>Dosage</th><th>Frequency</th><th>Duration</th><th>Confidence</th></tr>
        </thead>
        <tbody>
          {medicines.map((m) => (
            <tr key={m.id}>
              <td>{m.name}{m.corrected ? ' ✎' : ''}</td>
              <td>{m.dosage || '—'}</td>
              <td>{m.frequency || '—'}</td>
              <td>{m.duration || '—'}</td>
              <td>{Math.round(m.confidence * 100)}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      {interactions.length > 0 && (
        <div className="warn">
          <h3>⚠️ Interaction warnings</h3>
          <ul>{interactions.map((i) => <li key={i}>{i}</li>)}</ul>
        </div>
      )}

      <h3>Drug information</h3>
      {medicines.map((m) => {
        const info = getDrugInfo(m.name)
        return (
          <details key={m.id} className="drug-details">
            <summary>{info.name}</summary>
            <p>{info.description}</p>
            <p><strong>Usage:</strong> {info.usage}</p>
            <p><strong>Dosage:</strong> {info.dosageInfo}</p>
            <p><strong>Side effects:</strong> {info.sideEffects.join(', ')}</p>
            <p><strong>Precautions:</strong> {info.precautions.join(', ')}</p>
          </details>
        )
      })}

      <h3>Raw OCR text</h3>
      <pre>{prescription.rawText}</pre>
    </section>
  )
}
