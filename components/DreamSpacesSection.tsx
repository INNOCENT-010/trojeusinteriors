'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { DreamSpace } from '@/types'

function isVideo(url: string) {
  return /\.(mp4|mov|webm|ogg)/i.test(url)
}

function toLabel(cat: string) {
  return cat
    .split(/[-_]/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export default function DreamSpacesSection({ spaces }: { spaces: DreamSpace[] }) {
  const categories = Array.from(
    new Map(spaces.map(s => [s.category, s.category])).keys()
  )

  const [active, setActive] = useState<string>(categories[0] ?? '')
  const safeActive = categories.includes(active) ? active : (categories[0] ?? '')
  const activeSpaces = spaces.filter(s => s.category === safeActive)
  const hero = activeSpaces[0]

  if (categories.length === 0) return null

  return (
    <section
      style={{
        padding: '120px 0',
        background: 'var(--charcoal)',
        borderTop: '1px solid rgba(184,150,62,0.1)',
      }}
    >
      {/* Header */}
      <div style={{ padding: '0 40px', maxWidth: '1200px', margin: '0 auto 56px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
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
              Dream Spaces
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

        {/* Category tabs — fully dynamic */}
        <div
          style={{
            display: 'flex',
            gap: '0',
            marginTop: '40px',
            borderBottom: '1px solid rgba(184,150,62,0.15)',
          }}
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: safeActive === cat ? 'var(--brass)' : 'var(--muted)',
                background: 'none',
                border: 'none',
                borderBottom: safeActive === cat ? '1px solid var(--brass)' : '1px solid transparent',
                padding: '12px 28px 12px 0',
                cursor: 'pointer',
                marginBottom: '-1px',
                transition: 'color 0.2s ease',
              }}
            >
              {toLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '0 40px', maxWidth: '1200px', margin: '0 auto' }}>
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
            <Link
              href={`/dream-spaces/${hero.slug}`}
              style={{
                textDecoration: 'none',
                display: 'block',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                className="project-card"
                style={{ height: '100%', minHeight: '520px', background: 'var(--charcoal-light)' }}
              >
                {hero.images[0] && (
                  isVideo(hero.images[0]) ? (
                    <video
                      src={hero.images[0]}
                      autoPlay
                      muted
                      loop
                      playsInline
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <Image
                      src={hero.images[0]}
                      alt={hero.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  )
                )}
                <div className="project-card-overlay" />
                <div style={{ position: 'absolute', bottom: '28px', left: '28px', zIndex: 2 }}>
                  <p className="overline" style={{ marginBottom: '6px', opacity: 0.7 }}>
                    {toLabel(hero.category)}
                  </p>
                  <h3
                    style={{
                      fontFamily: 'var(--font-cormorant)',
                      fontSize: '28px',
                      fontWeight: 400,
                      color: 'var(--offwhite)',
                      lineHeight: 1.1,
                    }}
                  >
                    {hero.title}
                  </h3>
                  {hero.description && (
                    <p
                      style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '11px',
                        color: 'rgba(244,239,232,0.55)',
                        marginTop: '8px',
                        maxWidth: '280px',
                        lineHeight: 1.6,
                      }}
                    >
                      {hero.description}
                    </p>
                  )}
                  {hero.related_project_slug && (
                    <p
                      style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '9px',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: 'var(--brass)',
                        marginTop: '12px',
                      }}
                    >
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
                <Link
                  key={space.id}
                  href={`/dream-spaces/${space.slug}`}
                  style={{ textDecoration: 'none', flex: 1, display: 'block' }}
                >
                  <div
                    className="project-card"
                    style={{ height: '100%', minHeight: '257px', background: 'var(--charcoal-light)' }}
                  >
                    {space.images[0] && (
                      isVideo(space.images[0]) ? (
                        <video
                          src={space.images[0]}
                          autoPlay
                          muted
                          loop
                          playsInline
                          style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <Image
                          src={space.images[0]}
                          alt={space.title}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      )
                    )}
                    <div className="project-card-overlay" />
                    <div style={{ position: 'absolute', bottom: '20px', left: '20px', zIndex: 2 }}>
                      <h3
                        style={{
                          fontFamily: 'var(--font-cormorant)',
                          fontSize: '20px',
                          fontWeight: 400,
                          color: 'var(--offwhite)',
                        }}
                      >
                        {space.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}