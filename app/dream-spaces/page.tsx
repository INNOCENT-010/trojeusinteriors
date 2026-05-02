import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Image from 'next/image'
import { getDreamSpaces } from '@/lib/queries'
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

export default async function DreamSpacesPage() {
  const spaces = await getDreamSpaces()

  // Derive unique ordered categories from actual data
  const categories = Array.from(
    new Map(spaces.map((s: DreamSpace) => [s.category, s.category])).keys()
  )

  const byCategory = Object.fromEntries(
    categories.map(cat => [cat, spaces.filter((s: DreamSpace) => s.category === cat)])
  )

  return (
    <main style={{ background: 'var(--charcoal)', color: 'var(--offwhite)', minHeight: '100vh' }}>
      <Navbar />

      {/* Page header */}
      <section style={{ padding: '160px 40px 80px', maxWidth: '1200px', margin: '0 auto' }}>
        <p className="overline" style={{ marginBottom: '20px' }}>Curated environments</p>
        <h1
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(48px, 6vw, 88px)',
            fontWeight: 300,
            lineHeight: 0.95,
            color: 'var(--offwhite)',
          }}
        >
          Dream
          <br />
          <em style={{ fontStyle: 'italic', color: 'var(--brass-light)' }}>Spaces</em>
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '13px',
            fontWeight: 300,
            color: 'var(--muted)',
            lineHeight: 1.8,
            maxWidth: '480px',
            marginTop: '24px',
            letterSpacing: '0.02em',
          }}
        >
          Every room is a story. Explore our curated collections — each designed to inspire
          your next transformation.
        </p>
      </section>

      {/* Category sections — fully dynamic */}
      {categories.map(cat => {
        const catSpaces = byCategory[cat] ?? []
        return (
          <section
            key={cat}
            style={{
              padding: '80px 40px',
              maxWidth: '1200px',
              margin: '0 auto',
              borderTop: '1px solid rgba(184,150,62,0.1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: '40px',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: 'clamp(28px, 3vw, 44px)',
                  fontWeight: 300,
                  color: 'var(--offwhite)',
                }}
              >
                {toLabel(cat)}
              </h2>
              <span
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '9px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--brass)',
                  opacity: 0.6,
                }}
              >
                {catSpaces.length} {catSpaces.length === 1 ? 'space' : 'spaces'}
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '2px',
              }}
            >
              {catSpaces.map(space => (
                <Link
                  key={space.id}
                  href={`/dream-spaces/${space.slug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    className="project-card"
                    style={{ aspectRatio: '4/3', background: 'var(--charcoal-light)' }}
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
                    <div style={{ position: 'absolute', bottom: '24px', left: '24px', zIndex: 2 }}>
                      <h3
                        style={{
                          fontFamily: 'var(--font-cormorant)',
                          fontSize: '22px',
                          fontWeight: 400,
                          color: 'var(--offwhite)',
                        }}
                      >
                        {space.title}
                      </h3>
                      {space.description && (
                        <p
                          style={{
                            fontFamily: 'var(--font-inter)',
                            fontSize: '11px',
                            color: 'rgba(244,239,232,0.55)',
                            marginTop: '6px',
                            lineHeight: 1.5,
                          }}
                        >
                          {space.description.slice(0, 80)}{space.description.length > 80 ? '…' : ''}
                        </p>
                      )}
                      {space.related_project_slug && (
                        <p
                          style={{
                            fontFamily: 'var(--font-inter)',
                            fontSize: '9px',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: 'var(--brass)',
                            marginTop: '10px',
                          }}
                        >
                          See project →
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )
      })}

      <footer
        style={{
          padding: '48px 40px',
          borderTop: '1px solid rgba(184,150,62,0.1)',
          textAlign: 'center',
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            textDecoration: 'none',
          }}
        >
          ← Back to home
        </Link>
      </footer>
    </main>
  )
}