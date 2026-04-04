'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const navLinks = [
  { href: '/projects', label: 'Projects' },
  { href: '/renders', label: '3D Renders' },
  { href: '/product-design', label: 'Product Design' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '0 40px',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled ? 'rgba(17,17,17,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(184,150,62,0.12)' : '1px solid transparent',
        transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '20px',
              fontWeight: 400,
              color: 'var(--offwhite)',
              letterSpacing: '0.08em',
              lineHeight: 1,
            }}
          >
            TROJEUS
          </span>
          <span
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '8px',
              fontWeight: 400,
              color: 'var(--brass)',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
            }}
          >
            Interiors
          </span>
        </div>
      </Link>

      {/* Desktop nav */}
      <nav
        style={{ display: 'flex', gap: '40px', alignItems: 'center' }}
        className="hidden-mobile"
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '10px',
              fontWeight: 400,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              color: pathname === link.href ? 'var(--brass)' : 'rgba(244,239,232,0.7)',
              transition: 'color 0.3s ease',
              borderBottom: pathname === link.href ? '1px solid var(--brass)' : '1px solid transparent',
              paddingBottom: '2px',
            }}
            onMouseEnter={(e) => {
              if (pathname !== link.href)
                (e.target as HTMLElement).style.color = 'var(--offwhite)'
            }}
            onMouseLeave={(e) => {
              if (pathname !== link.href)
                (e.target as HTMLElement).style.color = 'rgba(244,239,232,0.7)'
            }}
          >
            {link.label}
          </Link>
        ))}
        <Link href="/contact" className="btn-brass" style={{ padding: '10px 24px', fontSize: '9px' }}>
          Get in touch
        </Link>
      </nav>

      {/* Mobile hamburger */}
      <button
        className="show-mobile"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          padding: '4px',
        }}
        aria-label="Toggle menu"
      >
        <span style={{ display: 'block', width: '24px', height: '1px', background: menuOpen ? 'var(--brass)' : 'var(--offwhite)', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
        <span style={{ display: menuOpen ? 'none' : 'block', width: '24px', height: '1px', background: 'var(--offwhite)' }} />
        <span style={{ display: 'block', width: '24px', height: '1px', background: menuOpen ? 'var(--brass)' : 'var(--offwhite)', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '72px',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(17,17,17,0.98)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '40px',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '36px',
                fontWeight: 300,
                color: pathname === link.href ? 'var(--brass)' : 'var(--offwhite)',
                textDecoration: 'none',
                letterSpacing: '0.05em',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </header>
  )
}
