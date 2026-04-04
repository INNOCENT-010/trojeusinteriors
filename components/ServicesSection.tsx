'use client'

import { useState } from 'react'
import Image from 'next/image'

const services = [
  {
    number: '01',
    title: 'Spatial Planning',
    description: 'Precision floor plans, traffic-flow analysis, and material specification — every square metre designed with intention.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80',
    tag: 'Floor plans · Material boards · Flow analysis',
  },
  {
    number: '02',
    title: '3D Visualisation',
    description: 'Photorealistic renders that let you inhabit a space before a single wall is built. Confidence before commitment.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
    tag: 'Renders · Walkthroughs · Material studies',
  },
  {
    number: '03',
    title: 'Product Design',
    description: 'Signature bedframes, cushions, and bed walls crafted as bespoke objects — furniture as a form of fine art.',
    image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=1200&q=80',
    tag: 'Bedframes · Cushions · Bed walls',
  },
  {
    number: '04',
    title: 'Turnkey Execution',
    description: 'From concept to handover. We manage every contractor, material, and milestone so you never have to.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
    tag: 'Project management · Procurement · Delivery',
  },
]

export default function ServicesSection() {
  const [active, setActive] = useState(0)

  return (
    <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 40px' }}>
      {/* Heading */}
      <div style={{ marginBottom: '72px' }}>
        <p className="overline" style={{ marginBottom: '16px' }}>What we do</p>
        <h2
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(40px, 5vw, 68px)',
            fontWeight: 300,
            lineHeight: 1.05,
            color: 'var(--offwhite)',
          }}
        >
          Design as a
          <br />
          <em style={{ fontStyle: 'italic', color: 'var(--brass-light)' }}>discipline.</em>
        </h2>
      </div>

      {/* Mobile — image shown above active service */}
      <div
        style={{
          display: 'none',
          marginBottom: '32px',
          position: 'relative',
          aspectRatio: '16/9',
          overflow: 'hidden',
          width: '100%',
        }}
        className="services-mobile-image"
      >
        {services.map((s, i) => (
          <div
            key={s.number}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: active === i ? 1 : 0,
              transition: 'opacity 0.7s cubic-bezier(0.25,0.46,0.45,0.94)',
            }}
          >
            <Image
              src={s.image}
              alt={s.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="100vw"
            />
            <div style={{ position: 'absolute', top: '16px', right: '16px', width: '28px', height: '28px', borderTop: '1px solid var(--brass)', borderRight: '1px solid var(--brass)', opacity: 0.6 }} />
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', width: '28px', height: '28px', borderBottom: '1px solid var(--brass)', borderLeft: '1px solid var(--brass)', opacity: 0.6 }} />
          </div>
        ))}
      </div>

      {/* Desktop — two column layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          alignItems: 'start',
        }}
        className="services-desktop-grid"
      >
        {/* Left — service rows */}
        <div>
          <div className="divider" />
          {services.map((s, i) => (
            <div
              key={s.number}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              style={{
                padding: '36px 0',
                borderBottom: '1px solid rgba(184,150,62,0.12)',
                cursor: 'pointer',
                display: 'grid',
                gridTemplateColumns: '56px 1fr',
                gap: '24px',
                alignItems: 'start',
                opacity: active === i ? 1 : 0.45,
                transition: 'opacity 0.3s ease',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '12px',
                  color: active === i ? 'var(--brass)' : 'var(--muted)',
                  letterSpacing: '0.1em',
                  paddingTop: '6px',
                  transition: 'color 0.3s ease',
                }}
              >
                {s.number}
              </span>
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: 'clamp(22px, 2.5vw, 32px)',
                    fontWeight: 400,
                    color: active === i ? 'var(--offwhite)' : 'var(--muted)',
                    lineHeight: 1.1,
                    marginBottom: '12px',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {s.title}
                </h3>
                <div
                  style={{
                    overflow: 'hidden',
                    maxHeight: active === i ? '120px' : '0px',
                    opacity: active === i ? 1 : 0,
                    transition: 'max-height 0.5s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.4s ease',
                  }}
                >
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', fontWeight: 300, lineHeight: 1.9, color: 'var(--muted)', marginBottom: '12px' }}>
                    {s.description}
                  </p>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--brass)' }}>
                    {s.tag}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right — sticky image */}
        <div style={{ position: 'sticky', top: '100px', aspectRatio: '3/4', overflow: 'hidden' }}>
          {services.map((s, i) => (
            <div
              key={s.number}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: active === i ? 1 : 0,
                transition: 'opacity 0.7s cubic-bezier(0.25,0.46,0.45,0.94)',
              }}
            >
              <Image
                src={s.image}
                alt={s.title}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div style={{ position: 'absolute', top: '24px', right: '24px', width: '40px', height: '40px', borderTop: '1px solid var(--brass)', borderRight: '1px solid var(--brass)', opacity: 0.6 }} />
              <div style={{ position: 'absolute', bottom: '24px', left: '24px', width: '40px', height: '40px', borderBottom: '1px solid var(--brass)', borderLeft: '1px solid var(--brass)', opacity: 0.6 }} />
              <div style={{ position: 'absolute', bottom: '32px', right: '32px' }}>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--brass)' }}>
                  {s.number} / 04
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .services-desktop-grid {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
          }
          .services-desktop-grid > div:last-child {
            display: none !important;
          }
          .services-mobile-image {
            display: block !important;
          }
        }
      `}</style>
    </section>
  )
}