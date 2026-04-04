import Navbar from '@/components/Navbar'
import Link from 'next/link'

export const metadata = { title: 'Thank You' }

export default function ThankYouPage() {
  return (
    <main
      style={{
        background: 'var(--charcoal)',
        minHeight: '100vh',
        color: 'var(--offwhite)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar />
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '120px 40px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '600px' }}>
          {/* Brass ornament */}
          <div
            style={{
              width: '1px',
              height: '80px',
              background: 'linear-gradient(to bottom, transparent, var(--brass), transparent)',
              margin: '0 auto 48px',
            }}
          />
          <p className="overline" style={{ marginBottom: '24px' }}>Message received</p>
          <h1
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(48px, 7vw, 88px)',
              fontWeight: 300,
              lineHeight: 1.05,
              color: 'var(--offwhite)',
              marginBottom: '24px',
            }}
          >
            Thank
            <br />
            <em style={{ fontStyle: 'italic', color: 'var(--brass-light)' }}>you.</em>
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '14px',
              fontWeight: 300,
              color: 'var(--muted)',
              lineHeight: 1.9,
              marginBottom: '56px',
              letterSpacing: '0.02em',
            }}
          >
            We&apos;ve received your message and will be in touch within 48 hours.
            <br />
            In the meantime, explore our work.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/projects" className="btn-brass-filled">
              View Projects
            </Link>
            <Link href="/" className="btn-brass">
              Back to Home
            </Link>
          </div>

          <div
            style={{
              width: '1px',
              height: '80px',
              background: 'linear-gradient(to bottom, var(--brass), transparent)',
              margin: '64px auto 0',
            }}
          />
        </div>
      </div>
    </main>
  )
}
