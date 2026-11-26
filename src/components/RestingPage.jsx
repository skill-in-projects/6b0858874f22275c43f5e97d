import { pageStyle } from '../styles.js'

// Shown when the database is resting. Visitors see a calm message and no technical details.
export default function RestingPage() {
  return (
    <main style={pageStyle}>
      <p style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>This app is resting and will be back soon.</p>
    </main>
  )
}
