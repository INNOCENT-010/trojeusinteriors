import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import ProductStrip from '@/components/ProductStrip'
import { getFeaturedProjects } from '@/lib/queries'
import { supabase } from '@/lib/supabase'
import type { Project } from '@/types'
import ServicesSection from '@/components/ServicesSection'

const navLinks = [
  { href: '/projects', label: 'Projects' },
  { href: '/renders', label: '3D Renders' },
  { href: '/product-design', label: 'Product Design' },
  { href: '/contact', label: 'Contact' },
]

const PLACEHOLDER = 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80'
const PLACEHOLDER_WIDE = 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1400&q=80'

const services = [
  {
    number: '01',
    title: 'Spatial Planning',
    description:
      'Precision floor plans, traffic-flow analysis, and material specification — every square metre designed with intention.',
  },
  {
    number: '02',
    title: '3D Visualisation',
    description:
      'Photorealistic renders that let you inhabit a space before a single wall is built. Confidence before commitment.',
  },
  {
    number: '03',
    title: 'Product Design',
    description:
      'Signature bedframes, cushions, and bed walls crafted as bespoke objects — furniture as a form of fine art.',
  },
  {
    number: '04',
    title: 'Turnkey Execution',
    description:
      'From concept to handover. We manage every contractor, material, and milestone so you never have to.',
  },
]

export default async function HomePage() {
  let featuredProjects: Project[] = []
  let productCategories: string[] = []

  try {
    featuredProjects = await getFeaturedProjects()
  } catch {
    // Supabase not yet configured — will show placeholder UI
  }

  try {
    const { data } = await supabase
      .from('categories')
      .select('name')
      .eq('type', 'product')
      .order('name')
    productCategories = data?.map((c) => c.name) ?? []
  } catch {
    // fallback to empty
  }

  return (
    <main style={{ background: 'var(--charcoal)', color: 'var(--offwhite)', minHeight: '100vh' }}>
      <Navbar />

      {/* ── HERO ── */}
      <section
        style={{
          position: 'relative',
          height: '100vh',
          minHeight: '600px',
          display: 'flex',
          alignItems: 'flex-end',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0 }}>
          <Image
            src={PLACEHOLDER_WIDE}
            alt="Trojeusinteriors — luxury interior"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(17,17,17,0.75) 0%, rgba(17,17,17,0.45) 50%, rgba(17,17,17,0.7) 100%)',
            }}
          />
        </div>

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            padding: '0 40px 80px',
            maxWidth: '900px',
            width: '100%',
          }}
        >
          <p className="overline fade-up" style={{ marginBottom: '24px' }}>
            Lagos · Nigeria
          </p>
          <h1
            className="fade-up fade-up-delay-1"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(56px, 8vw, 120px)',
              fontWeight: 300,
              lineHeight: 0.95,
              color: 'var(--offwhite)',
              marginBottom: '32px',
            }}
          >
            We design
            <br />
            <em style={{ fontStyle: 'italic', color: 'var(--brass-light)' }}>spaces</em>
            <br />
            that endure.
          </h1>
          <p
            className="fade-up fade-up-delay-2"
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '14px',
              fontWeight: 300,
              lineHeight: 1.8,
              color: 'rgba(244,239,232,0.7)',
              maxWidth: '400px',
              marginBottom: '40px',
              letterSpacing: '0.02em',
            }}
          >
            Bespoke interiors, 3D visualisations, and signature furniture
            for clients who demand more than the ordinary.
          </p>
          <div className="fade-up fade-up-delay-3" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/projects" className="btn-brass-filled">
              View Projects
            </Link>
            <Link href="/contact" className="btn-brass">
              Start a project
            </Link>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '9px',
              letterSpacing: '0.2em',
              color: 'var(--brass)',
              textTransform: 'uppercase',
              writingMode: 'vertical-lr',
            }}
          >
            Scroll
          </span>
          <div style={{ width: '1px', height: '48px', background: 'var(--brass)', opacity: 0.5 }} />
        </div>
      </section>

      <ServicesSection />

      {/* ── FEATURED PROJECTS ── */}
      <section style={{ padding: '0 40px 120px', maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '48px',
          }}
        >
          <div>
            <p className="overline" style={{ marginBottom: '16px' }}>Selected work</p>
            <h2
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: 'clamp(36px, 4.5vw, 60px)',
                fontWeight: 300,
                color: 'var(--offwhite)',
              }}
            >
              Featured Projects
            </h2>
          </div>
          <Link
            href="/projects"
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
            All projects →
          </Link>
        </div>

        {featuredProjects.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2px',
            }}
          >
            {featuredProjects.map((project, i) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="project-card"
                  style={{
                    aspectRatio: i === 0 ? '4/3' : '1/1',
                    background: 'var(--charcoal-light)',
                  }}
                >
                  <Image
                    src={project.cover_image || PLACEHOLDER}
                    alt={project.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="project-card-overlay" />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '24px',
                      left: '24px',
                      zIndex: 2,
                    }}
                  >
                    <p className="overline" style={{ marginBottom: '6px', opacity: 0.8 }}>
                      {project.category} · {project.year}
                    </p>
                    <h3
                      style={{
                        fontFamily: 'var(--font-cormorant)',
                        fontSize: '24px',
                        fontWeight: 400,
                        color: 'var(--offwhite)',
                        lineHeight: 1.1,
                      }}
                    >
                      {project.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '11px',
                        color: 'rgba(244,239,232,0.6)',
                        marginTop: '4px',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {project.location}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                style={{
                  aspectRatio: n === 1 ? '4/3' : '1/1',
                  background: 'var(--charcoal-light)',
                  border: '1px solid rgba(184,150,62,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '14px',
                    color: 'var(--brass)',
                    opacity: 0.4,
                    letterSpacing: '0.1em',
                  }}
                >
                  Project {n}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── PRODUCT DESIGN STRIP ── */}
      <section
        style={{
          padding: '80px 0',
          background: 'var(--charcoal-light)',
          borderTop: '1px solid rgba(184,150,62,0.1)',
          borderBottom: '1px solid rgba(184,150,62,0.1)',
        }}
      >
        <div style={{ padding: '0 40px', maxWidth: '1200px', margin: '0 auto 48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <p className="overline" style={{ marginBottom: '16px' }}>Objects & furniture</p>
              <h2
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: 'clamp(36px, 4.5vw, 60px)',
                  fontWeight: 300,
                  color: 'var(--offwhite)',
                }}
              >
                Product Design
              </h2>
            </div>
            <Link
              href="/product-design"
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
              Explore →
            </Link>
          </div>

          {/* Dynamic category pills */}
          {productCategories.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '24px', flexWrap: 'wrap' }}>
              {productCategories.map((cat) => (
                <Link
                  key={cat}
                  href={`/product-design?category=${cat.toLowerCase()}`}
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '9px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--brass)',
                    textDecoration: 'none',
                    border: '1px solid rgba(184,150,62,0.3)',
                    padding: '6px 14px',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}
        </div>

        <ProductStrip />
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ padding: '80px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '40px',
            borderTop: '1px solid rgba(184,150,62,0.15)',
            borderBottom: '1px solid rgba(184,150,62,0.15)',
            padding: '60px 0',
          }}
        >
          {[
            { value: '8+', label: 'Years of practice' },
            { value: '60+', label: 'Projects completed' },
            { value: '100%', label: 'Client satisfaction' },
            { value: 'Lagos', label: 'Based in Nigeria' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <p
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: 'clamp(44px, 5vw, 64px)',
                  fontWeight: 300,
                  color: 'var(--brass-light)',
                  lineHeight: 1,
                  marginBottom: '8px',
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '10px',
                  fontWeight: 400,
                  color: 'var(--muted)',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          padding: '120px 40px',
          background: 'var(--charcoal-deep)',
          borderTop: '1px solid rgba(184,150,62,0.15)',
          textAlign: 'center',
        }}
      >
        <p className="overline" style={{ marginBottom: '24px' }}>Ready to begin?</p>
        <h2
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(40px, 6vw, 80px)',
            fontWeight: 300,
            lineHeight: 1.05,
            color: 'var(--offwhite)',
            maxWidth: '700px',
            margin: '0 auto 24px',
          }}
        >
          Let&apos;s build your
          <br />
          <em style={{ fontStyle: 'italic', color: 'var(--brass-light)' }}>dream space.</em>
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '13px',
            fontWeight: 300,
            color: 'var(--muted)',
            lineHeight: 1.9,
            maxWidth: '480px',
            margin: '0 auto 48px',
            letterSpacing: '0.02em',
          }}
        >
          Whether it&apos;s a Lagos penthouse, an Ibadan family home, or a commercial flagship —
          every project starts with a conversation.
        </p>
        <Link href="/contact" className="btn-brass" style={{ fontSize: '10px' }}>
          Start the conversation
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          padding: '48px 40px',
          borderTop: '1px solid rgba(184,150,62,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <p
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '16px',
              fontWeight: 400,
              color: 'var(--offwhite)',
              letterSpacing: '0.08em',
            }}
          >
            TROJEUS INTERIORS
          </p>
          <p
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '10px',
              color: 'var(--muted)',
              marginTop: '4px',
              letterSpacing: '0.1em',
            }}
          >
            Lagos, Nigeria
          </p>
        </div>
        <div style={{ display: 'flex', gap: '32px' }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '10px',
            color: 'var(--muted)',
            letterSpacing: '0.08em',
          }}
        >
          © {new Date().getFullYear()} Trojeusinteriors
        </p>
      </footer>
    </main>
  )
}