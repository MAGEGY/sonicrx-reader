import { useEffect, useState } from 'react'
import ScanScreen from './components/ScanScreen'
import HistoryScreen from './components/HistoryScreen'
import FloatingHelp from './components/FloatingHelp'
import type { HelpFunction, HelpHowTo } from './components/FloatingHelp'
import { loadEgyptDrugs } from './lib/egyptDrugs'

type Tab = 'scan' | 'history'

const HELP_HOWTOS: HelpHowTo[] = [
  { title: 'Scan your first prescription', body: 'Tap "Start camera", point at the prescription and tap "Capture & scan" — or use "Upload image" with a photo. The first scan downloads the OCR language model (10-15 MB), afterwards it is instant.' },
  { title: 'Fix a misread medicine name', body: 'Next to each recognized medicine, tap "Correct" and type the right name. Your corrections are remembered and improve future scans automatically.' },
  { title: 'See drug information', body: 'Tap "Info" next to a medicine to see usage, dosage guidance, side effects, precautions and contraindications.' },
  { title: 'Print or share a report', body: 'Open the History tab, tap "Open report" on any scan, then use the print button — the report includes the medicine table, interaction warnings and the raw OCR text.' },
  { title: 'Interaction warnings', body: 'When more than one medicine is recognized, the app automatically checks for potential interactions and shows a warning box.' },
]

export default function App() {
  const [tab, setTab] = useState<Tab>('scan')

  useEffect(() => {
    loadEgyptDrugs().catch(() => {
      // Registry stays unavailable; drug info falls back to the built-in dictionary
    })
  }, [])

  const functions: HelpFunction[] = [
    { label: 'Scan a prescription', description: 'Start the camera or upload a photo and run OCR', action: () => { setTab('scan'); window.dispatchEvent(new Event('help:start-camera')) } },
    { label: 'Upload an image', description: 'Use a photo from your device instead of the camera', action: () => { setTab('scan'); window.dispatchEvent(new Event('help:upload')) } },
    { label: 'History & reports', description: 'Open past scans and their printable reports', action: () => setTab('history') },
  ]

  return (
    <div className="app">
      <header className="header">
        <h1>💊 SonicRx Reader</h1>
        <p className="subtitle">Scan prescriptions, recognize medicines, get drug information</p>
      </header>
      <nav className="tabs">
        <button className={tab === 'scan' ? 'tab active' : 'tab'} onClick={() => setTab('scan')}>
          Scan
        </button>
        <button className={tab === 'history' ? 'tab active' : 'tab'} onClick={() => setTab('history')}>
          History
        </button>
      </nav>
      <main>{tab === 'scan' ? <ScanScreen /> : <HistoryScreen />}</main>
      <footer className="footer">
        Not a medical device. Always verify with a healthcare professional.
      </footer>
      <FloatingHelp functions={functions} howtos={HELP_HOWTOS} />
    </div>
  )
}
