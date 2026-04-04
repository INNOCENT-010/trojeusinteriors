'use client'

import Navbar from '@/components/Navbar'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    supabase
      .from('product_designs')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
      .then(({ data }) => {
        setProduct(data)
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return (
      <main style={{ background: 'var(--charcoal)', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ padding: '200px 40px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '24px', color: 'var(--muted)' }}>Loading...</p>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main style={{ background: 'var(--charcoal)', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ padding: '200px 40px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '24px', color: 'var(--muted)' }}>Product not found.</p>
          <Link href="/product-design" style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: 'var(--brass)', textDecoration: 'none', letterSpacing: '0.15em', display: 'block', marginTop: '16px' }}>← Back to Product Design</Link>
        </div>
      </main>
    )
  }

  return (
    <main style={{ background: 'var(--charcoal)', minHeight: '100vh', color: 'var(--offwhite)' }}>
      <Navbar />
      <div style={{ padding: '120px 40px 100px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Back link */}
        <Link
          href="/product-design"
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '10px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--brass)',
            textDecoration: 'none',
            display: 'inline-block',
            marginBottom: '60px',
          }}
        >
          ← Product Design
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>

          {/* Left — images */}
          <div>
            {/* Main image */}
            <div
              style={{
                position: 'relative',
                aspectRatio: '3/4',
                overflow: 'hidden',
                marginBottom: '12px',
              }}
            >
              {product.images?.[activeImage] && (
                <Image
                  src={product.images[activeImage]}
                  alt={product.title}
                  fill
                  style={{ objectFit: 'cover', transition: 'opacity 0.4s ease' }}
                  priority
                />
              )}
              {/* Brass corners */}
              <div style={{ position: 'absolute', top: '20px', right: '20px', width: '32px', height: '32px', borderTop: '1px solid var(--brass)', borderRight: '1px solid var(--brass)', opacity: 0.5 }} />
              <div style={{ position: 'absolute', bottom: '20px', left: '20px', width: '32px', height: '32px', borderBottom: '1px solid var(--brass)', borderLeft: '1px solid var(--brass)', opacity: 0.5 }} />
            </div>

            {/* Thumbnail strip */}
            {product.images?.length > 1 && (
              <div style={{ display: 'flex', gap: '8px' }}>
                {product.images.map((img: string, i: number) => (
                  <div
                    key={i}
                    onClick={() => setActiveImage(i)}
                    style={{
                      position: 'relative',
                      width: '72px',
                      height: '72px',
                      cursor: 'pointer',
                      border: activeImage === i ? '1px solid var(--brass)' : '1px solid transparent',
                      transition: 'border-color 0.3s ease',
                      flexShrink: 0,
                    }}
                  >
                    <Image src={img} alt={`view-${i}`} fill style={{ objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right — details */}
          <div style={{ paddingTop: '20px' }}>
            <p className="overline" style={{ marginBottom: '16px', textTransform: 'capitalize' }}>
              {product.category}
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: 'clamp(36px, 4vw, 56px)',
                fontWeight: 300,
                lineHeight: 1.05,
                color: 'var(--offwhite)',
                marginBottom: '32px',
              }}
            >
              {product.title}
            </h1>

            <div className="brass-line" style={{ marginBottom: '32px' }} />

            <p
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '20px',
                fontWeight: 300,
                lineHeight: 1.7,
                color: 'rgba(244,239,232,0.8)',
                fontStyle: 'italic',
                marginBottom: '48px',
              }}
            >
              {product.description}
            </p>

            <div
              style={{
                padding: '32px',
                border: '1px solid rgba(184,150,62,0.15)',
                marginBottom: '40px',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '9px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--brass)',
                  marginBottom: '12px',
                }}
              >
                Commission this piece
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '13px',
                  fontWeight: 300,
                  color: 'var(--muted)',
                  lineHeight: 1.8,
                  marginBottom: '24px',
                }}
              >
                Every piece is made to order. Lead times, materials, and dimensions
                are discussed during your consultation.
              </p>
              <Link href={`/contact?interest=${encodeURIComponent(product.title)}`} className="btn-brass" style={{ fontSize: '10px' }}>
                Enquire about this piece
              </Link>
            </div>

            <Link
              href="/product-design"
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                textDecoration: 'none',
              }}
            >
              ← Back to all pieces
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}