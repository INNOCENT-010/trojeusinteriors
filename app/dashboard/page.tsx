'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const DASHBOARD_PASSWORD = 'trojeus2025'

export default function DashboardLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const handleLogin = () => {
    if (password === DASHBOARD_PASSWORD) {
      sessionStorage.setItem('dashboard_auth', 'true')
      router.push('/dashboard/projects')
    } else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0F0F0F',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ width: '100%', maxWidth: '400px', padding: '0 24px' }}>
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <p
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '28px',
              fontWeight: 400,
              color: 'var(--offwhite)',
              letterSpacing: '0.08em',
            }}
          >
            TROJEUS
          </p>
          <p
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '9px',
              color: 'var(--brass)',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              marginTop: '4px',
            }}
          >
            Studio Dashboard
          </p>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '9px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--brass)',
              display: 'block',
              marginBottom: '8px',
            }}
          >
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%',
              background: '#1A1A1A',
              border: error ? '1px solid #c0392b' : '1px solid rgba(184,150,62,0.25)',
              padding: '14px 16px',
              fontFamily: 'var(--font-inter)',
              fontSize: '14px',
              color: 'var(--offwhite)',
              outline: 'none',
              transition: 'border-color 0.3s ease',
            }}
            placeholder="Enter password"
          />
          {error && (
            <p
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '11px',
                color: '#c0392b',
                marginTop: '8px',
              }}
            >
              Incorrect password
            </p>
          )}
        </div>

        <button
          onClick={handleLogin}
          className="btn-brass"
          style={{ width: '100%', fontSize: '10px', marginTop: '8px' }}
        >
          Enter Dashboard
        </button>
      </div>
    </div>
  )
}