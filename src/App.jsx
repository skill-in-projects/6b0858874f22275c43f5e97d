import { useEffect, useState } from 'react'

// Sample cats for the first version. Levels are kept only in page state, so they reset on reload.
const START_CATS = [
  { name: 'Miso', level: 82 },
  { name: 'Biscuit', level: 35 },
  { name: 'Luna', level: 61 },
  { name: 'Pepper', level: 12 },
]

const pageStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
  boxSizing: 'border-box',
  fontFamily: 'system-ui, sans-serif',
  color: '#111827',
  background: '#fff7ed',
}

const cardStyle = {
  width: '100%',
  maxWidth: 440,
  background: '#ffffff',
  borderRadius: 20,
  boxShadow: '0 10px 30px rgba(17, 24, 39, 0.12)',
  padding: 28,
  textAlign: 'center',
}

const chipStyle = (active) => ({
  padding: '8px 14px',
  borderRadius: 999,
  border: '1px solid #dc2626',
  background: active ? '#dc2626' : '#ffffff',
  color: active ? '#ffffff' : '#991b1b',
  fontWeight: 600,
  cursor: 'pointer',
})

const buttonStyle = {
  padding: '10px 18px',
  borderRadius: 10,
  border: 'none',
  background: '#dc2626',
  color: '#ffffff',
  fontWeight: 600,
  cursor: 'pointer',
}

// A small fly that hops to a new random spot every second and a half, so it flies all over the page.
// It ignores mouse clicks, so it never blocks the buttons.
function Fly() {
  const [spot, setSpot] = useState({ x: 50, y: 20 })

  useEffect(() => {
    const timer = setInterval(() => {
      setSpot({ x: 5 + Math.random() * 90, y: 5 + Math.random() * 90 })
    }, 1500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: `${spot.x}%`,
        top: `${spot.y}%`,
        width: 36,
        transition: 'left 1.4s ease-in-out, top 1.4s ease-in-out',
        animation: 'fly-jump 0.5s ease-in-out infinite',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      <style>{'@keyframes fly-jump { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }'}</style>
      <svg viewBox="0 0 40 40" width="36" height="36">
        <ellipse cx="14" cy="14" rx="9" ry="6" fill="#ffffff" fillOpacity="0.7" stroke="#6b7280" strokeWidth="1" transform="rotate(-25 14 14)" />
        <ellipse cx="26" cy="14" rx="9" ry="6" fill="#ffffff" fillOpacity="0.7" stroke="#6b7280" strokeWidth="1" transform="rotate(25 26 14)" />
        <ellipse cx="20" cy="26" rx="7" ry="8" fill="#374151" />
        <circle cx="20" cy="17" r="4" fill="#ef4444" />
        <line x1="17" y1="32" x2="12" y2="37" stroke="#374151" strokeWidth="1.5" />
        <line x1="23" y1="32" x2="28" y2="37" stroke="#374151" strokeWidth="1.5" />
      </svg>
    </div>
  )
}

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

export default function App() {
  const [cats, setCats] = useState(START_CATS)
  const [selected, setSelected] = useState(0)

  const cat = cats[selected]
  const color = colorFor(cat.level)
  const arcEnd = pointOn(cat.level, 80)
  const needleTip = pointOn(cat.level, 66)

  function setLevel(level) {
    setCats((list) => list.map((c, i) => (i === selected ? { ...c, level } : c)))
  }

  function shake() {
    setLevel(Math.floor(Math.random() * 101))
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
          style={{ width: '100%', accentColor: color }}
        />

        <div style={{ marginTop: 18 }}>
          <button type="button" style={buttonStyle} onClick={shake}>
            Shake the meter
          </button>
        </div>

        <p style={{ margin: '18px 0 0', fontSize: 13, color: '#9ca3af' }}>
          Not saved yet: upgrade to keep your changes
        </p>
      </section>
      <Fly />
    </main>
  )
}
