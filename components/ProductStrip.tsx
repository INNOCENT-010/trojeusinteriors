'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type CategoryCard = {
  category: string
  image: string | null
  slug: string | null
}

function isVideo(url: string) {
  return /\.(mp4|mov|webm|ogg)/i.test(url)
}

function toLabel(cat: string) {
  return cat
    .split(/[-_]/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export default function ProductStrip() {
  const [categoryCards, setCategoryCards] = useState<CategoryCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('product_designs')
      .select('id, title, slug, category, images')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        const products = data ?? []
        const seen = new Map<string, { image: string | null; slug: string | null }>()
        products.forEach((p) => {
          if (!seen.has(p.category)) {
            seen.set(p.category, {
              image: p.images?.[0] ?? null,
              slug: p.slug ?? null,
            })
          }
        })
        const cards: CategoryCard[] = Array.from(seen.entries()).map(([category, meta]) => ({
          category,
          image: meta.image,
          slug: meta.slug,
        }))
        setCategoryCards(cards)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="scroll-strip" style={{ padding: '0 40px', gap: '12px' }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            style={{
              flexShrink: 0,
              width: '260px',
              aspectRatio: '3/4',
              background: 'var(--charcoal)',
              border: '1px solid rgba(184,150,62,0.08)',
            }}
          />
        ))}
      </div>
    )
  }

  if (categoryCards.length === 0) {
    return (
      <div className="scroll-strip" style={{ padding: '0 40px', gap: '12px' }}>
        {['Bedframe', 'Cushion', 'Bedwall',  'Accessorie'].map((label) => (
          <Link
            key={label}
            href={`/product-design?category=${label.toLowerCase()}`}
            style={{ textDecoration: 'none', flexShrink: 0 }}
          >
            <div
              style={{
                width: '260px',
                aspectRatio: '3/4',
                background: 'var(--charcoal)',
                border: '1px solid rgba(184,150,62,0.12)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '24px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '28px',
                  height: '28px',
                  borderTop: '1px solid var(--brass)',
                  borderRight: '1px solid var(--brass)',
                  opacity: 0.4,
                }}
              />
              <div className="brass-line" style={{ marginBottom: '16px' }} />
              <h3
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '26px',
                  fontWeight: 400,
                  color: 'var(--offwhite)',
                }}
              >
                {label}s
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '9px',
                  color: 'var(--brass)',
                  letterSpacing: '0.15em',
                  marginTop: '6px',
                  opacity: 0.5,
                }}
              >
                Coming soon
              </p>
            </div>
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div className="scroll-strip" style={{ padding: '0 40px', gap: '12px' }}>
      {categoryCards.map(({ category, image }) => (
        <Link
          key={category}
          href={`/product-design?category=${category.toLowerCase()}`}
          style={{ textDecoration: 'none', flexShrink: 0 }}
        >
          <div
            style={{
              width: '260px',
              aspectRatio: '3/4',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              background: 'var(--charcoal)',
              border: image ? 'none' : '1px solid rgba(184,150,62,0.12)',
            }}
            onMouseEnter={(e) => {
              const media = e.currentTarget.querySelector('img, video') as HTMLElement
              if (media) media.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              const media = e.currentTarget.querySelector('img, video') as HTMLElement
              if (media) media.style.transform = 'scale(1)'
            }}
          >
            {image && (
              isVideo(image) ? (
                <video
                  src={image}
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
                    transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  }}
                />
              ) : (
                <Image
                  src={image}
                  alt={toLabel(category)}
                  fill
                  style={{
                    objectFit: 'cover',
                    transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  }}
                />
              )
            )}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: image
                  ? 'linear-gradient(to top, rgba(17,17,17,0.88) 0%, transparent 55%)'
                  : 'transparent',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '28px',
                height: '28px',
                borderTop: '1px solid var(--brass)',
                borderRight: '1px solid var(--brass)',
                opacity: 0.6,
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '24px',
                left: '24px',
                zIndex: 2,
              }}
            >
              <div className="brass-line" style={{ marginBottom: '12px' }} />
              <h3
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '26px',
                  fontWeight: 400,
                  color: 'var(--offwhite)',
                  lineHeight: 1.1,
                }}
              >
                {toLabel(category)}s
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '9px',
                  color: 'var(--brass)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginTop: '6px',
                }}
              >
                Explore →
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}