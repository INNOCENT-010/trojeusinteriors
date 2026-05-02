'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { DreamSpace } from '@/types'

const CATEGORIES = ['kitchen', 'bedroom', 'living-room']
const LABELS: Record<string, string> = {
  kitchen: 'Kitchen',
  bedroom: 'Bedroom',
  'living-room': 'Living Room',
}

const PLACEHOLDERS: Record<string, string> = {
  kitchen: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80',
  bedroom: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=80',
  'living-room': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80',
}

export default function DreamSpacesSection({ spaces }: { spaces: DreamSpace[] }) {
  const [active, setActive] = useState('kitchen')
  const sectionRef = useRef<HTMLElement>(null)

  const byCategory = Object.fromEntries(
    CATEGORIES.map(cat => [cat, spaces.filter(s => s.category === cat)])
  )

  const activeSpaces = byCategory[active] ?? []
  const hero = activeSpaces[0]

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '120px 0',
        background: 'var(--charcoal)',
        borderTop: '1px solid rgba(184,150,62,0.1)',
      }}
    >
      {/* Header */}
      <div style={{ padding: '0 40px', maxWidth: '1200px', margin: '0 auto 56px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <p className="overline" style={{ marginBottom: '16px' }}>Curated environments</p>
            <h2
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: 'clamp(36px, 4.5vw, 60px)',
                fontWeight: 300,
                color: 'var(--offwhite)',
              }}
            >
               Spaces
            </h2>
          </div>
          <Link
            href="/dream-spaces"
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--brass)',
              textDecoration: 'none',
              borderBottom: '1px solid var(--brass)',
              paddingBottom: '2px',
            }}
          >
            Explore all →
          </Link>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: '0', marginTop: '40px', borderBottom: '1px solid rgba(184,150,62,0.15)' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: active === cat ? 'var(--brass)' : 'var(--muted)',
                background: 'none',
                border: 'none',
                borderBottom: active === cat ? '1px solid var(--brass)' : '1px solid transparent',
                padding: '12px 28px 12px 0',
                cursor: 'pointer',
                marginBottom: '-1px',
                transition: 'color 0.2s ease',
              }}
            >
              {LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '0 40px', maxWidth: '1200px', margin: '0 auto' }}>
        {activeSpaces.length === 0 ? (
          /* Placeholder when no data */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2px',
              height: '560px',
            }}
          >
            <div
              style={{
                position: 'relative',
                background: 'var(--charcoal-light)',
                border: '1px solid rgba(184,150,62,0.08)',
                overflow: 'hidden',
              }}
            >
              <Image
                src={PLACEHOLDERS[active]}
                alt={LABELS[active]}
                fill
                style={{ objectFit: 'cover', opacity: 0.5 }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(17,17,17,0.8) 0%, transparent 60%)' }} />
              <div style={{ position: 'absolute', bottom: '32px', left: '32px' }}>
                <p className="overline" style={{ marginBottom: '8px', opacity: 0.6 }}>{LABELS[active]}</p>
                <h3 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '32px', fontWeight: 300, color: 'var(--offwhite)' }}>
                  Coming Soon
                </h3>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {[1, 2].map(n => (
                <div
                  key={n}
                  style={{
                    flex: 1,
                    background: 'var(--charcoal-light)',
                    border: '1px solid rgba(184,150,62,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '13px', color: 'var(--brass)', opacity: 0.3, letterSpacing: '0.1em' }}>
                    {LABELS[active]} {n + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: activeSpaces.length === 1 ? '1fr' : '1fr 1fr',
              gap: '2px',
              minHeight: '520px',
            }}
          >
            {/* Hero card */}
            {hero && (
              <Link href={`/dream-spaces/${hero.slug}`} style={{ textDecoration: 'none', display: 'block', position: 'relative', overflow: 'hidden' }}>
                <div className="project-card" style={{ height: '100%', minHeight: '520px', background: 'var(--charcoal-light)' }}>
                  {hero.images[0] && (
                    <Image src={hero.images[0]} alt={hero.title} fill style={{ objectFit: 'cover' }} />
                  )}
                  <div className="project-card-overlay" />
                  <div style={{ position: 'absolute', bottom: '28px', left: '28px', zIndex: 2 }}>
                    <p className="overline" style={{ marginBottom: '6px', opacity: 0.7 }}>{LABELS[hero.category]}</p>
                    <h3 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '28px', fontWeight: 400, color: 'var(--offwhite)', lineHeight: 1.1 }}>
                      {hero.title}
                    </h3>
                    {hero.description && (
                      <p style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: 'rgba(244,239,232,0.55)', marginTop: '8px', maxWidth: '280px', lineHeight: 1.6 }}>
                        {hero.description}
                      </p>
                    )}
                    {hero.related_project_slug && (
                      <p style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--brass)', marginTop: '12px' }}>
                        View Project →
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            )}

            {/* Secondary cards */}
            {activeSpaces.length > 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {activeSpaces.slice(1, 3).map(space => (
                  <Link key={space.id} href={`/dream-spaces/${space.slug}`} style={{ textDecoration: 'none', flex: 1, display: 'block' }}>
                    <div className="project-card" style={{ height: '100%', minHeight: '257px', background: 'var(--charcoal-light)' }}>
                      {space.images[0] && (
                        <Image src={space.images[0]} alt={space.title} fill style={{ objectFit: 'cover' }} />
                      )}
                      <div className="project-card-overlay" />
                      <div style={{ position: 'absolute', bottom: '20px', left: '20px', zIndex: 2 }}>
                        <h3 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '20px', fontWeight: 400, color: 'var(--offwhite)' }}>
                          {space.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}