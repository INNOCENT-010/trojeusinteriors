'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const links = [
  { href: '/dashboard/projects', label: 'Projects', icon: '◫' },
  { href: '/dashboard/products', label: 'Products', icon: '◻' },
  { href: '/dashboard/categories', label: 'Categories', icon: '◈' },
  { href: '/dashboard/submissions', label: 'Submissions', icon: '◉' },
  { href: '/dashboard/dream-spaces', label: 'Dream Spaces', icon: '✦' },
  { href: '/dashboard/hero', label: 'Hero Editor', icon: '◈' },
]

export default function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    sessionStorage.removeItem('dashboard_auth')
    router.push('/dashboard')
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="dashboard-sidebar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '240px',
          background: '#1A1A1A',
          borderRight: '1px solid rgba(184,150,62,0.1)',
          display: 'flex',
          flexDirection: 'column',
          padding: '40px 0',
          zIndex: 50,
        }}
      >
        <div style={{ padding: '0 28px 40px', borderBottom: '1px solid rgba(184,150,62,0.1)' }}>
          <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '18px', fontWeight: 400, color: 'var(--offwhite)', letterSpacing: '0.08em' }}>
            TROJEUS
          </p>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '8px', color: 'var(--brass)', letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: '4px' }}>
            Dashboard
          </p>
        </div>

        <nav style={{ flex: 1, padding: '32px 0' }}>
          {links.map((link) => {
            const active = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: 'block',
                  padding: '12px 28px',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  color: active ? 'var(--brass)' : 'var(--muted)',
                  borderLeft: active ? '2px solid var(--brass)' : '2px solid transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '0 28px' }}>
          <Link href="/" style={{ display: 'block', fontFamily: 'var(--font-inter)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none', marginBottom: '12px' }}>
            ← View Site
          </Link>
          <button
            onClick={handleLogout}
            style={{ background: 'none', border: 'none', fontFamily: 'var(--font-inter)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', cursor: 'pointer', padding: 0 }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav
        className="dashboard-bottom-nav"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#1A1A1A',
          borderTop: '1px solid rgba(184,150,62,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 8px',
          height: '64px',
          zIndex: 100,
        }}
      >
        {links.map((link) => {
          const active = pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'none',
                padding: '8px 12px',
                flex: 1,
              }}
            >
              <span style={{ fontSize: '18px', color: active ? 'var(--brass)' : 'var(--muted)', lineHeight: 1 }}>
                {link.icon}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '8px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: active ? 'var(--brass)' : 'var(--muted)',
                }}
              >
                {link.label}
              </span>
            </Link>
          )
        })}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 12px',
            flex: 1,
          }}
        >
          <span style={{ fontSize: '18px', color: 'var(--muted)', lineHeight: 1 }}>⎋</span>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            Exit
          </span>
        </button>
      </nav>

      <style>{`
        @media (min-width: 769px) {
          .dashboard-bottom-nav { display: none !important; }
        }
        @media (max-width: 768px) {
          .dashboard-sidebar { display: none !important; }
        }
      `}</style>
    </>
  )
}
