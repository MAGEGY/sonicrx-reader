import { useState } from 'react'
import ScanScreen from './components/ScanScreen'
import HistoryScreen from './components/HistoryScreen'

type Tab = 'scan' | 'history'

export default function App() {
  const [tab, setTab] = useState<Tab>('scan')

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
    </div>
  )
}
