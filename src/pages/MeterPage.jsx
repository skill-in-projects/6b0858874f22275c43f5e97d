import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import RestingPage from '../components/RestingPage.jsx'
import { apiFetch } from '../lib/api.js'
import { buttonStyle, cardStyle, pageStyle } from '../styles.js'

const chipStyle = (active) => ({
  padding: '8px 14px',
  borderRadius: 999,
  border: '1px solid #dc2626',
  background: active ? '#dc2626' : '#ffffff',
  color: active ? '#ffffff' : '#991b1b',
  fontWeight: 600,
  cursor: 'pointer',
})

function describe(level) {
  if (level < 34) return 'Calm. Fully committed to a nap.'
  if (level < 67) return 'Watching the window. Might be interested.'
  return 'Full FOMO. Something good is happening somewhere else.'
}

function colorFor(level) {
  if (level < 34) return '#0ea5e9'
  if (level < 67) return '#f59e0b'
  return '#ef4444'
}

// Point on the top half of the dial: level 0 is the left end, 100 the right end.
function pointOn(level, radius) {
  const angle = Math.PI * (1 - level / 100)
  return { x: 100 + radius * Math.cos(angle), y: 100 - radius * Math.sin(angle) }
}

export default function MeterPage() {
  const [cats, setCats] = useState(null)
  const [selected, setSelected] = useState(0)
  const [error, setError] = useState(null)

  useEffect(() => {
    apiFetch('/api/cats').then(setCats).catch(setError)
  }, [])

  if (error?.code === 'database_resting') return <RestingPage />

  if (!cats) {
    return (
      <main style={pageStyle}>
        <p style={{ color: '#6b7280' }}>{error ? error.message : 'Loading...'}</p>
      </main>
    )
  }

  const cat = cats[selected]
  const color = colorFor(cat.level)
  const arcEnd = pointOn(cat.level, 80)
  const needleTip = pointOn(cat.level, 66)

  // Changes the level on screen; saveLevel stores it once the slider is let go or shaken.
  function setLevel(level) {
    setCats((list) => list.map((c, i) => (i === selected ? { ...c, level } : c)))
  }

  function saveLevel(index, level) {
    apiFetch(`/api/cats/${encodeURIComponent(cats[index].name)}/level`, {
      method: 'PUT',
      body: JSON.stringify({ level }),
    })
      .then(() => setError(null))
      .catch(setError)
  }

  function shake() {
    const level = Math.floor(Math.random() * 101)
    setLevel(level)
    saveLevel(selected, level)
  }

  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <h1 style={{ margin: '0 0 4px', fontSize: 26 }}>Cat FOMO Meter</h1>
        <p style={{ margin: '0 0 20px', color: '#6b7280' }}>How much is your cat missing out right now?</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
          {cats.map((c, i) => (
            <button
              key={c.name}
              type="button"
              aria-pressed={i === selected}
              style={chipStyle(i === selected)}
              onClick={() => setSelected(i)}
            >
              {c.name}
            </button>
          ))}
        </div>

        <svg viewBox="0 0 200 120" role="img" aria-label={`${cat.name} is at ${cat.level} percent FOMO`} style={{ width: '100%', maxWidth: 320 }}>
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#e5e7eb" strokeWidth="14" strokeLinecap="round" />
          {cat.level > 0 && (
            <path d={`M 20 100 A 80 80 0 0 1 ${arcEnd.x} ${arcEnd.y}`} fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" />
          )}
          <line x1="100" y1="100" x2={needleTip.x} y2={needleTip.y} stroke="#111827" strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="100" r="6" fill="#111827" />
        </svg>

        <div style={{ fontSize: 48, fontWeight: 700, color, lineHeight: 1.1 }}>{cat.level}%</div>
        <p style={{ margin: '6px 0 18px', color: '#374151' }}>{describe(cat.level)}</p>

        <input
          type="range"
          min="0"
          max="100"
          value={cat.level}
          aria-label={`FOMO level for ${cat.name}`}
          onChange={(e) => setLevel(Number(e.target.value))}
          onPointerUp={() => saveLevel(selected, cat.level)}
          onKeyUp={() => saveLevel(selected, cat.level)}
          style={{ width: '100%', accentColor: color }}
        />

        <div style={{ marginTop: 18 }}>
          <button type="button" style={buttonStyle} onClick={shake}>
            Shake the meter
          </button>
        </div>

        <div style={{ marginTop: 14 }}>
          <Link to="/psychologist" style={{ ...chipStyle(false), display: 'inline-block', textDecoration: 'none' }}>
            Ask the cat psychologist
          </Link>
        </div>

        {error && <p style={{ margin: '14px 0 0', fontSize: 13, color: '#b91c1c' }}>{error.message}</p>}
      </section>
    </main>
  )
}
