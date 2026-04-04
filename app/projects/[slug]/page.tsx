import Navbar from '@/components/Navbar'
import { getProjectBySlug, getAllProjects } from '@/lib/queries'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Project } from '@/types'
import ProjectGallery from '@/components/ProjectGallery'

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
    return { title: project.title, description: project.description }
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
  } catch {}
  if (!project) notFound()

  return (
    <main style={{ background: 'var(--charcoal)', minHeight: '100vh', color: 'var(--offwhite)' }}>
      <Navbar />

      {/* HERO */}
      <div style={{ position: 'relative', height: '60vh', minHeight: '300px', overflow: 'hidden' }}>
        <Image
          src={project.cover_image}
          alt={project.title}
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(17,17,17,0.92) 0%, rgba(17,17,17,0.2) 60%, transparent 100%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '28px',
          left: '20px', right: '20px', zIndex: 2,
        }}>
          <p className="overline" style={{ marginBottom: '10px', fontSize: '8px' }}>
            {project.category} · {project.location} · {project.year}
          </p>
          <h1 style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(28px, 6vw, 80px)',
            fontWeight: 300, lineHeight: 1.05,
            color: 'var(--offwhite)', maxWidth: '800px',
          }}>
            {project.title}
          </h1>
        </div>
      </div>

      {/* INFO */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px 60px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '40px',
          marginBottom: '56px',
        }}>
          {/* Meta chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {[
              { label: 'Category', value: project.category },
              { label: 'Location', value: project.location },
              { label: 'Year', value: String(project.year) },
              { label: 'Render type', value: project.render_type },
            ].map((item) => (
              <div key={item.label} style={{
                borderBottom: '1px solid rgba(184,150,62,0.12)',
                paddingBottom: '14px',
                flex: '1 1 130px',
              }}>
                <p style={{
                  fontFamily: 'var(--font-inter)', fontSize: '9px',
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                  color: 'var(--brass)', marginBottom: '6px',
                }}>
                  {item.label}
                </p>
                <p style={{
                  fontFamily: 'var(--font-cormorant)', fontSize: '18px',
                  fontWeight: 400, color: 'var(--offwhite)', textTransform: 'capitalize',
                }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <div className="brass-line" style={{ marginBottom: '24px' }} />
            <p style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(18px, 2.5vw, 28px)',
              fontWeight: 300, lineHeight: 1.6,
              color: 'var(--offwhite)', fontStyle: 'italic',
            }}>
              {project.description}
            </p>
          </div>
        </div>

        {/* Gallery */}
        {project.images && project.images.length > 0 && (
          <ProjectGallery images={project.images} title={project.title} />
        )}
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 20px', textAlign: 'center',
        borderTop: '1px solid rgba(184,150,62,0.12)',
        background: 'var(--charcoal-deep)',
      }}>
        <p className="overline" style={{ marginBottom: '16px' }}>Like what you see?</p>
        <h2 style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: 'clamp(30px, 5vw, 64px)',
          fontWeight: 300, color: 'var(--offwhite)',
          marginBottom: '32px', lineHeight: 1.05,
        }}>
          Let&apos;s create your
          <br />
          <em style={{ fontStyle: 'italic', color: 'var(--brass-light)' }}>next space.</em>
        </h2>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/contact" className="btn-brass-filled">Start a project</Link>
          <Link href="/projects" className="btn-brass">More projects</Link>
        </div>
      </section>
    </main>
  )
}