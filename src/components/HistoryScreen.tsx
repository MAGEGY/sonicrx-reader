import { useState } from 'react'
import { deletePrescription, getMedicinesFor, getPrescriptions } from '../lib/storage'
import type { Prescription } from '../lib/types'
import ReportScreen from './ReportScreen'

export default function HistoryScreen() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(getPrescriptions())
  const [openId, setOpenId] = useState<number | null>(null)

  if (openId !== null) {
    return <ReportScreen id={openId} onBack={() => setOpenId(null)} />
  }

  return (
    <section className="history">
      <h2>Prescription history</h2>
      {prescriptions.length === 0 && <p>No scans yet. Go to the Scan tab to start.</p>}
      <ul className="history-list">
        {[...prescriptions].reverse().map((p) => {
          const meds = getMedicinesFor(p.id)
          return (
            <li key={p.id}>
              <div className="history-row">
                <div>
                  <strong>{new Date(p.processedDate).toLocaleString()}</strong>
                  <span className="muted"> · {meds.length} medicines</span>
                  <p className="muted preview">{p.rawText.slice(0, 80)}…</p>
                </div>
                <div className="actions-inline">
                  <button className="small" onClick={() => setOpenId(p.id)}>Open report</button>
                  <button
                    className="small danger"
                    onClick={() => {
                      if (confirm('Delete this prescription?')) {
                        deletePrescription(p.id)
                        setPrescriptions(getPrescriptions())
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
