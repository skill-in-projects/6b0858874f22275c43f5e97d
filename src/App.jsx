import { HashRouter, Route, Routes } from 'react-router-dom'
import Fly from './components/Fly.jsx'
import MeterPage from './pages/MeterPage.jsx'
import PsychologistPage from './pages/PsychologistPage.jsx'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MeterPage />} />
        <Route path="/psychologist" element={<PsychologistPage />} />
      </Routes>
      <Fly />
    </HashRouter>
  )
}
