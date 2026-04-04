import Navbar from '@/components/Navbar'
import { getProjectBySlug, getAllProjects } from '@/lib/queries'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Project } from '@/types'

export async function generateStaticParams() {
  try {
    const projects = await getAllProjects()
    return projects.map((p: Project) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const project = await getProjectBySlug(slug)
    if (!project) return { title: 'Project Not Found' }
    return {
      title: project.title,
      description: project.description,
    }
  } catch {
    return { title: 'Project' }
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  let project: Project | null = null

  try {
    project = await getProjectBySlug(slug)
  } catch {
    // Supabase not yet configured
  }

  if (!project) notFound()

  return (
    <main style={{ background: 'var(--charcoal)', minHeight: '100vh', color: 'var(--offwhite)' }}>
      <Navbar />

      {/* ── HERO IMAGE ── */}
      <div style={{ position: 'relative', height: '85vh', minHeight: '500px', overflow: 'hidden' }}>
        <Image
          src={project.cover_image}
          alt={project.title}
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(17,17,17,0.9) 0%, rgba(17,17,17,0.2) 60%, transparent 100%)',
          }}
        />
        {/* Project title over hero */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            left: '40px',
            right: '40px',
            zIndex: 2,
          }}
        >
          <p className="overline" style={{ marginBottom: '16px' }}>
            {project.category} · {project.location} · {project.year}
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(44px, 6vw, 88px)',
              fontWeight: 300,
              lineHeight: 1.0,
              color: 'var(--offwhite)',
              maxWidth: '800px',
            }}
          >
            {project.title}
          </h1>
        </div>
      </div>

      {/* ── PROJECT INFO ── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 40px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: '80px',
            alignItems: 'start',
            marginBottom: '80px',
          }}
        >
          {/* Meta sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {[
              { label: 'Category', value: project.category },
              { label: 'Location', value: project.location },
              { label: 'Year', value: String(project.year) },
              { label: 'Render type', value: project.render_type },
            ].map((item) => (
              <div key={item.label} style={{ borderBottom: '1px solid rgba(184,150,62,0.12)', paddingBottom: '24px' }}>
                <p
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '9px',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'var(--brass)',
                    marginBottom: '8px',
                  }}
                >
                  {item.label}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '20px',
                    fontWeight: 400,
                    color: 'var(--offwhite)',
                    textTransform: 'capitalize',
                  }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <div className="brass-line" style={{ marginBottom: '32px' }} />
            <p
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: 'clamp(22px, 2.5vw, 32px)',
                fontWeight: 300,
                lineHeight: 1.5,
                color: 'var(--offwhite)',
                marginBottom: '32px',
                fontStyle: 'italic',
              }}
            >
              {project.description}
            </p>
          </div>
        </div>

        {/* ── IMAGE GALLERY ── */}
        {project.images && project.images.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {/* First image — full width */}
            {project.images[0] && (
              <div style={{ position: 'relative', aspectRatio: '16/9', width: '100%', overflow: 'hidden' }}>
                <Image
                  src={project.images[0]}
                  alt={`${project.title} — image 1`}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            )}

            {/* Remaining images — 2 column grid */}
            {project.images.length > 1 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '2px',
                }}
              >
                {project.images.slice(1).map((img, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'relative',
                      aspectRatio: '4/3',
                      overflow: 'hidden',
                    }}
                  >
                    <Image
                      src={img}
                      alt={`${project.title} — image ${i + 2}`}
                      fill
                      style={{ objectFit: 'cover', transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── CTA FOOTER ── */}
      <section
        style={{
          padding: '100px 40px',
          textAlign: 'center',
          borderTop: '1px solid rgba(184,150,62,0.12)',
          background: 'var(--charcoal-deep)',
        }}
      >
        <p className="overline" style={{ marginBottom: '20px' }}>Like what you see?</p>
        <h2
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 300,
            color: 'var(--offwhite)',
            marginBottom: '40px',
            lineHeight: 1.05,
          }}
        >
          Let&apos;s create your
          <br />
          <em style={{ fontStyle: 'italic', color: 'var(--brass-light)' }}>next space.</em>
        </h2>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/contact" className="btn-brass-filled">
            Start a project
          </Link>
          <Link href="/projects" className="btn-brass">
            More projects
          </Link>
        </div>
      </section>
    </main>
  )
}