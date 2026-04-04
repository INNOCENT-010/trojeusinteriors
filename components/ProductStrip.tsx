'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ProductStrip() {
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    supabase
      .from('product_designs')
      .select('id, title, slug, category, images')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => setProducts(data ?? []))
  }, [])

  if (products.length === 0) {
    return (
      <div className="scroll-strip" style={{ padding: '0 40px', gap: '12px' }}>
        {['Bedframes', 'Cushions', 'Bed Walls', 'Lighting', 'Accessories'].map((label) => (
          <div
            key={label}
            style={{
              flexShrink: 0,
              width: '260px',
              aspectRatio: '3/4',
              background: 'var(--charcoal)',
              border: '1px solid rgba(184,150,62,0.12)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '24px',
            }}
          >
            <div className="brass-line" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '26px', fontWeight: 400, color: 'var(--offwhite)' }}>
              {label}
            </h3>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="scroll-strip" style={{ padding: '0 40px', gap: '12px' }}>
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/product-design/${product.slug}`}
          style={{ textDecoration: 'none', flexShrink: 0 }}
        >
          <div
            style={{
              width: '260px',
              aspectRatio: '3/4',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              const img = e.currentTarget.querySelector('img') as HTMLElement
              if (img) img.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              const img = e.currentTarget.querySelector('img') as HTMLElement
              if (img) img.style.transform = 'scale(1)'
            }}
          >
            {product.images?.[0] && (
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                style={{
                  objectFit: 'cover',
                  transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                }}
              />
            )}
            {/* Gradient overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(17,17,17,0.85) 0%, transparent 55%)',
              }}
            />
            {/* Brass corner */}
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
            {/* Text */}
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
                  fontSize: '24px',
                  fontWeight: 400,
                  color: 'var(--offwhite)',
                  marginBottom: '4px',
                  lineHeight: 1.1,
                }}
              >
                {product.title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '9px',
                  color: 'var(--brass)',
                  letterSpacing: '0.15em',
                  textTransform: 'capitalize',
                }}
              >
                {product.category}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}