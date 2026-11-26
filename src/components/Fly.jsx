import { useEffect, useState } from 'react'

// A small fly that hops to a new random spot every second and a half, so it flies all over the page.
// It ignores mouse clicks, so it never blocks the buttons.
export default function Fly() {
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
