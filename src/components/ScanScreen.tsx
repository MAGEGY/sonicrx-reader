import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { recognizeMedicines } from '../lib/recognizer'
import { checkInteractions, getDrugInfo } from '../lib/drugInfo'
import { addCorrection, savePrescription } from '../lib/storage'
import type { DrugInfo, Medicine, Prescription } from '../lib/types'

type Status = 'idle' | 'camera' | 'ocr' | 'done' | 'error'

export default function ScanScreen() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [lang, setLang] = useState('eng')
  const [rawText, setRawText] = useState('')
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [selected, setSelected] = useState<DrugInfo | null>(null)
  const [interactions, setInteractions] = useState<string[]>([])
  const [error, setError] = useState('')

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setStatus('camera')
    } catch {
      setError('Camera not available. Use "Upload image" instead.')
      setStatus('error')
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }

  async function runOcr(canvas: HTMLCanvasElement) {
    setStatus('ocr')
    stopCamera()
    try {
      const result = await window.Tesseract.recognize(canvas, lang)
      processText(result.data.text)
    } catch {
      setError('OCR failed. Please try again.')
      setStatus('error')
    }
  }

  function capture() {
    const video = videoRef.current
    if (!video) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')!.drawImage(video, 0, 0)
    runOcr(canvas)
  }

  function onUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      canvas.getContext('2d')!.drawImage(img, 0, 0)
      runOcr(canvas)
    }
    img.src = URL.createObjectURL(file)
  }

  function processText(text: string) {
    const trimmed = text.trim()
    if (!trimmed) {
      setError('No text recognized. Try a clearer photo.')
      setStatus('error')
      return
    }
    const prescription: Prescription = {
      id: 0,
      rawText: trimmed,
      processedDate: Date.now(),
      doctorName: '',
      patientName: '',
      notes: '',
    }
    const found = recognizeMedicines(trimmed, 0)
    const id = savePrescription(prescription, found)
    setRawText(trimmed)
    setMedicines(found.map((m) => ({ ...m, prescriptionId: id })))
    setSelected(null)
    setInteractions(checkInteractions(found.map((m) => m.name)))
    setStatus('done')
  }

  function correctName(medicine: Medicine) {
    const input = prompt(`Correct medicine name "${medicine.name}":`, medicine.name)
    if (input && input !== medicine.name) {
      addCorrection(medicine.name, input)
      setMedicines((ms) =>
        ms.map((m) => (m.id === medicine.id ? { ...m, name: input, corrected: true } : m)),
      )
    }
  }

  function reset() {
    setRawText('')
    setMedicines([])
    setSelected(null)
    setInteractions([])
    setError('')
    setStatus('idle')
  }

  return (
    <section className="scan">
      {(status === 'idle' || status === 'error') && (
        <div className="actions">
          <button className="primary" onClick={startCamera}>📷 Start camera</button>
          <label className="primary upload">
            🖼 Upload image
            <input type="file" accept="image/*" onChange={onUpload} hidden />
          </label>
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="eng">English</option>
            <option value="ara">Arabic</option>
          </select>
          {error && <p className="error">{error}</p>}
        </div>
      )}

      {status === 'camera' && (
        <div className="camera">
          <video ref={videoRef} autoPlay playsInline />
          <div className="actions">
            <button className="primary" onClick={capture}>📸 Capture & scan</button>
            <button onClick={reset}>Cancel</button>
          </div>
        </div>
      )}

      {status === 'ocr' && <p className="loading">⏳ Running OCR… first scan downloads the language model.</p>}

      {status === 'done' && (
        <div className="results">
          <h2>Recognized medicines ({medicines.length})</h2>
          {medicines.length === 0 && <p>No medicines recognized in the text.</p>}
          <ul className="med-list">
            {medicines.map((m) => (
              <li key={m.id}>
                <div className="med-row">
                  <strong>{m.name}</strong>
                  <span className="badge">{Math.round(m.confidence * 100)}%</span>
                  <button className="small" onClick={() => correctName(m)}>Correct</button>
                  <button className="small" onClick={() => setSelected(getDrugInfo(m.name))}>Info</button>
                </div>
                <div className="med-details">
                  {m.dosage && <span>💊 {m.dosage}</span>}
                  {m.frequency && <span>🔁 {m.frequency}</span>}
                  {m.duration && <span>📅 {m.duration}</span>}
                </div>
              </li>
            ))}
          </ul>

          {interactions.length > 0 && (
            <div className="warn">
              <h3>⚠️ Interaction warnings</h3>
              <ul>{interactions.map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
          )}

          <details>
            <summary>Raw OCR text</summary>
            <pre>{rawText}</pre>
          </details>

          {selected && (
            <div className="drug-info">
              <h3>{selected.name} <small>{selected.genericName}</small></h3>
              <p>{selected.description}</p>
              <p><strong>Usage:</strong> {selected.usage}</p>
              <p><strong>Dosage:</strong> {selected.dosageInfo}</p>
              <div className="info-cols">
                <div><h4>Side effects</h4><ul>{selected.sideEffects.map((s) => <li key={s}>{s}</li>)}</ul></div>
                <div><h4>Precautions</h4><ul>{selected.precautions.map((s) => <li key={s}>{s}</li>)}</ul></div>
                <div><h4>Contraindications</h4><ul>{selected.contraindications.map((s) => <li key={s}>{s}</li>)}</ul></div>
              </div>
            </div>
          )}

          <button className="primary" onClick={reset}>Scan another</button>
        </div>
      )}
    </section>
  )
}
