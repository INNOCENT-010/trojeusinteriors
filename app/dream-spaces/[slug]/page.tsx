import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import DreamSpaceGallery from '@/components/DreamSpaceGallery'
import { supabase } from '@/lib/supabase'
import type { DreamSpace } from '@/types'

export const revalidate = 0

async function getDreamSpaceBySlug(slug: string): Promise<DreamSpace | null> {
  const { data, error } = await supabase
    .from('dream_spaces')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  if (error) { console.error(error); return null }
  return data
}

async function getRelatedProject(slug: string) {
  const { data } = await supabase
    .from('projects')
    .select('title, slug, cover_image')
    .eq('slug', slug)
    .single()
  return data
}

function isVideo(url: string) {
  return /\.(mp4|mov|webm|ogg)/i.test(url)
}

const LABELS: Record<string, string> = {
  kitchen: 'Kitchen',
  bedroom: 'Bedroom',
  'living-room': 'Living Room',
}

export default async function DreamSpaceSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const space = await getDreamSpaceBySlug(slug)

  if (!space) {
    return (
      <main
        style={{
          background: 'var(--charcoal)',
          color: 'var(--offwhite)',
          minHeight: '100vh',
        }}
      >
        <Navbar />
        <div style={{ padding: '200px 40px', textAlign: 'center' }}>
          <p
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '32px',
              color: 'var(--brass)',
            }}
          >
            Space not found
          </p>
          <Link
            href="/dream-spaces"
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '10px',
              color: 'var(--muted)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              marginTop: '24px',
              display: 'inline-block',
            }}
          >
            ← Back to Dream Spaces
          </Link>
        </div>
      </main>
    )
  }

  const relatedProject = space.related_project_slug
    ? await getRelatedProject(space.related_project_slug)
    : null

  return (
    <main
      style={{
        background: 'var(--charcoal)',
        color: 'var(--offwhite)',
        minHeight: '100vh',
      }}
    >
      <Navbar />

      {/* ── HERO — first media ── */}
      {space.images[0] && (
        <section
          style={{
            position: 'relative',
            height: '100vh',
            minHeight: '600px',
            overflow: 'hidden',
          }}
        >
          {isVideo(space.images[0]) ? (
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
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              priority
            />
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(17,17,17,0.85) 0%, rgba(17,17,17,0.3) 60%, transparent 100%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '64px',
              left: '40px',
              zIndex: 2,
            }}
          >
            <p className="overline" style={{ marginBottom: '16px' }}>
              {LABELS[space.category] ?? space.category}
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: 'clamp(48px, 6vw, 88px)',
                fontWeight: 300,
                lineHeight: 0.95,
                color: 'var(--offwhite)',
              }}
            >
              {space.title}
            </h1>
          </div>
        </section>
      )}

      {/* ── DESCRIPTION + RELATED PROJECT ── */}
      <section
        style={{
          padding: '80px 40px',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        {space.description && (
          <p
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '15px',
              fontWeight: 300,
              lineHeight: 1.9,
              color: 'rgba(244,239,232,0.75)',
              letterSpacing: '0.02em',
              marginBottom: relatedProject ? '48px' : '0',
            }}
          >
            {space.description}
          </p>
        )}

        {relatedProject && (
          <Link
            href={`/projects/${relatedProject.slug}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              border: '1px solid rgba(184,150,62,0.2)',
              padding: '20px',
              textDecoration: 'none',
              transition: 'border-color 0.3s ease',
            }}
          >
            {relatedProject.cover_image && (
              <div
                style={{
                  position: 'relative',
                  width: '80px',
                  height: '60px',
                  flexShrink: 0,
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={relatedProject.cover_image}
                  alt={relatedProject.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            )}
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '9px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--brass)',
                  marginBottom: '6px',
                }}
              >
                Related Project
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '22px',
                  fontWeight: 400,
                  color: 'var(--offwhite)',
                }}
              >
                {relatedProject.title}
              </p>
            </div>
            <p
              style={{
                marginLeft: 'auto',
                fontFamily: 'var(--font-inter)',
                fontSize: '9px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--brass)',
              }}
            >
              View →
            </p>
          </Link>
        )}
      </section>

      {/* ── GALLERY (client component with lightbox) ── */}
      <DreamSpaceGallery images={space.images} title={space.title} />

      {/* ── FOOTER NAV ── */}
      <div
        style={{
          padding: '48px 40px',
          borderTop: '1px solid rgba(184,150,62,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Link
          href="/dream-spaces"
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            textDecoration: 'none',
          }}
        >
          ← All Dream Spaces
        </Link>
        <Link
          href="/contact"
          className="btn-brass"
          style={{ fontSize: '9px', padding: '10px 24px' }}
        >
          Start a project
        </Link>
      </div>
    </main>
  )
}