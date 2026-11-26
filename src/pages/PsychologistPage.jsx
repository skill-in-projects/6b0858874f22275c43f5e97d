import { useState } from 'react'
import { Link } from 'react-router-dom'
import RestingPage from '../components/RestingPage.jsx'
import { apiFetch } from '../lib/api.js'
import { buttonStyle, cardStyle, pageStyle } from '../styles.js'

const GREETING = { role: 'model', text: "Meow. I'm Dr. Whiskers. What's on your mind about your cat today?" }

export default function PsychologistPage() {
  const [messages, setMessages] = useState([GREETING])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)

  async function send(event) {
    event.preventDefault()
    const text = draft.trim()
    if (!text || sending) return

    const history = messages
    setMessages([...history, { role: 'user', text }])
    setDraft('')
    setSending(true)
    setError(null)
    try {
      const data = await apiFetch('/api/psychologist/message', {
        method: 'POST',
        body: JSON.stringify({ message: text, history }),
      })
      setMessages((list) => [...list, { role: 'model', text: data.reply }])
    } catch (err) {
      setError(err)
    } finally {
      setSending(false)
    }
  }

  if (error?.code === 'database_resting') return <RestingPage />

  const canSend = !sending && draft.trim().length > 0

  return (
    <main style={pageStyle}>
      <section style={{ ...cardStyle, textAlign: 'left' }}>
        <h1 style={{ margin: '0 0 4px', fontSize: 26, textAlign: 'center' }}>Cat Psychologist</h1>
        <p style={{ margin: '0 0 16px', color: '#6b7280', textAlign: 'center' }}>Talk about your cat with Dr. Whiskers.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 240, maxHeight: 380, overflowY: 'auto', marginBottom: 16 }}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                padding: '10px 14px',
                borderRadius: 14,
                background: m.role === 'user' ? '#dc2626' : '#fee2e2',
                color: m.role === 'user' ? '#ffffff' : '#111827',
                whiteSpace: 'pre-wrap',
              }}
            >
              {m.text}
            </div>
          ))}
          {sending && <p style={{ margin: 0, color: '#6b7280' }}>Dr. Whiskers is thinking...</p>}
        </div>

        {error && <p style={{ margin: '0 0 10px', color: '#b91c1c' }}>{error.message}</p>}

        <form onSubmit={send} style={{ display: 'flex', gap: 8 }}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={1000}
            placeholder="Describe what your cat is doing"
            aria-label="Your message"
            style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid #fca5a5', fontSize: 15 }}
          />
          <button type="submit" disabled={!canSend} style={{ ...buttonStyle, opacity: canSend ? 1 : 0.5 }}>
            Send
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <Link to="/" style={{ color: '#991b1b', fontWeight: 600 }}>
            Back to the meter
          </Link>
        </div>
      </section>
    </main>
  )
}
