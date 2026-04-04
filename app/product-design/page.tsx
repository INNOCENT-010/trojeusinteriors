'use client'

import Navbar from '@/components/Navbar'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function isVideo(url: string) {
  return /\.(mp4|webm|ogg|mov)$/i.test(url) || url.includes('video')
}

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const touchStartX = useRef<number | null>(null)

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

  const images: string[] = product?.images ?? []

  const prev = useCallback(() => {
    setActiveImage(i => (i - 1 + images.length) % images.length)
  }, [images.length])

  const next = useCallback(() => {
    setActiveImage(i => (i + 1) % images.length)
  }, [images.length])

  useEffect(() => {
    if (!lightboxOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxOpen, prev, next])

  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxOpen])

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev()
    touchStartX.current = null
  }

  if (loading) {
    return (
      <main style={{ background: 'var(--charcoal)', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ padding: '200px 20px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '24px', color: 'var(--muted)' }}>Loading...</p>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main style={{ background: 'var(--charcoal)', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ padding: '200px 20px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '24px', color: 'var(--muted)' }}>Product not found.</p>
          <Link href="/product-design" style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: 'var(--brass)', textDecoration: 'none', letterSpacing: '0.15em', display: 'block', marginTop: '16px' }}>
            ← Back to Product Design
          </Link>
        </div>
      </main>
    )
  }

  const activeMedia = images[activeImage]

  return (
    <main style={{ background: 'var(--charcoal)', minHeight: '100vh', color: 'var(--offwhite)' }}>
      <Navbar />

      <div style={{ padding: '100px 20px 80px', maxWidth: '1200px', margin: '0 auto' }}>

        <Link
          href="/product-design"
          style={{
            fontFamily: 'var(--font-inter)', fontSize: '10px',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            color: 'var(--brass)', textDecoration: 'none',
            display: 'inline-block', marginBottom: '48px',
          }}
        >
          ← Product Design
        </Link>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '48px',
          alignItems: 'start',
        }}>

          {/* LEFT — media */}
          <div>
            {/* Main media */}
            <div
              onClick={() => setLightboxOpen(true)}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              style={{
                position: 'relative',
                aspectRatio: '3/4',
                overflow: 'hidden',
                marginBottom: '10px',
                cursor: 'zoom-in',
                background: '#111',
              }}
            >
              {activeMedia && (
                isVideo(activeMedia) ? (
                  <>
                    <video
                      src={activeMedia}
                      muted
                      playsInline
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(0,0,0,0.25)',
                    }}>
                      <div style={{
                        width: '52px', height: '52px', borderRadius: '50%',
                        border: '1px solid var(--brass)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{ color: 'var(--brass)', fontSize: '18px', marginLeft: '4px' }}>▶</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <Image
                    src={activeMedia}
                    alt={product.title}
                    fill
                    style={{ objectFit: 'cover', transition: 'opacity 0.3s ease' }}
                    priority
                  />
                )
              )}
              {/* Brass corners */}
              <div style={{ position: 'absolute', top: '16px', right: '16px', width: '28px', height: '28px', borderTop: '1px solid var(--brass)', borderRight: '1px solid var(--brass)', opacity: 0.4 }} />
              <div style={{ position: 'absolute', bottom: '16px', left: '16px', width: '28px', height: '28px', borderBottom: '1px solid var(--brass)', borderLeft: '1px solid var(--brass)', opacity: 0.4 }} />

              {/* Swipe arrows on mobile */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={e => { e.stopPropagation(); prev() }}
                    style={{
                      position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.4)', border: 'none', color: 'var(--offwhite)',
                      fontSize: '24px', cursor: 'pointer', padding: '8px 12px', zIndex: 2,
                    }}
                  >‹</button>
                  <button
                    onClick={e => { e.stopPropagation(); next() }}
                    style={{
                      position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.4)', border: 'none', color: 'var(--offwhite)',
                      fontSize: '24px', cursor: 'pointer', padding: '8px 12px', zIndex: 2,
                    }}
                  >›</button>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                {images.map((src, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveImage(i)}
                    style={{
                      position: 'relative',
                      width: '64px',
                      height: '64px',
                      flexShrink: 0,
                      cursor: 'pointer',
                      border: activeImage === i ? '1px solid var(--brass)' : '1px solid transparent',
                      transition: 'border-color 0.3s ease',
                      background: '#111',
                    }}
                  >
                    {isVideo(src) ? (
                      <div style={{
                        width: '100%', height: '100%', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        background: '#1a1a1a',
                      }}>
                        <span style={{ color: 'var(--brass)', fontSize: '14px' }}>▶</span>
                      </div>
                    ) : (
                      <Image src={src} alt={`thumb-${i}`} fill style={{ objectFit: 'cover' }} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — details */}
          <div style={{ paddingTop: '8px' }}>
            <p className="overline" style={{ marginBottom: '14px', textTransform: 'capitalize' }}>
              {product.category}
            </p>
            <h1 style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(32px, 4vw, 56px)',
              fontWeight: 300, lineHeight: 1.05,
              color: 'var(--offwhite)', marginBottom: '28px',
            }}>
              {product.title}
            </h1>

            <div className="brass-line" style={{ marginBottom: '28px' }} />

            <p style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(16px, 2vw, 20px)',
              fontWeight: 300, lineHeight: 1.7,
              color: 'rgba(244,239,232,0.8)',
              fontStyle: 'italic', marginBottom: '40px',
            }}>
              {product.description}
            </p>

            <div style={{
              padding: '28px',
              border: '1px solid rgba(184,150,62,0.15)',
              marginBottom: '32px',
            }}>
              <p style={{
                fontFamily: 'var(--font-inter)', fontSize: '9px',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'var(--brass)', marginBottom: '10px',
              }}>
                Commission this piece
              </p>
              <p style={{
                fontFamily: 'var(--font-inter)', fontSize: '13px',
                fontWeight: 300, color: 'var(--muted)',
                lineHeight: 1.8, marginBottom: '20px',
              }}>
                Every piece is made to order. Lead times, materials, and dimensions
                are discussed during your consultation.
              </p>
              <Link href={`/contact?interest=${encodeURIComponent(product.title)}`} className="btn-brass" style={{ fontSize: '10px' }}>
                Enquire about this piece
              </Link>
            </div>

            <Link href="/product-design" style={{
              fontFamily: 'var(--font-inter)', fontSize: '10px',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              color: 'var(--muted)', textDecoration: 'none',
            }}>
              ← Back to all pieces
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && images.length > 0 && (
        <div
          onClick={() => setLightboxOpen(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(8,8,8,0.98)',
            zIndex: 1000, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <p style={{
            position: 'absolute', top: '20px', left: '20px',
            fontFamily: 'var(--font-inter)', fontSize: '10px',
            letterSpacing: '0.15em', color: 'var(--brass)', zIndex: 10,
          }}>
            {activeImage + 1} / {images.length}
          </p>

          <button
            onClick={() => setLightboxOpen(false)}
            style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'none', border: '1px solid rgba(184,150,62,0.3)',
              color: 'var(--brass)', fontFamily: 'var(--font-inter)',
              fontSize: '10px', letterSpacing: '0.15em',
              padding: '8px 16px', cursor: 'pointer', zIndex: 10,
            }}
          >
            ESC
          </button>

          {images.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); prev() }}
              style={{
                position: 'absolute', left: '12px',
                background: 'none', border: 'none',
                color: 'var(--offwhite)', fontSize: '40px',
                cursor: 'pointer', padding: '16px', zIndex: 10, opacity: 0.6,
              }}
            >‹</button>
          )}

          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative', width: '92vw', height: '88vh',
              maxWidth: '1200px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            {isVideo(images[activeImage]) ? (
              <video
                src={images[activeImage]}
                controls
                autoPlay
                playsInline
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            ) : (
              <Image
                src={images[activeImage]}
                alt={`${product.title} — ${activeImage + 1}`}
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            )}
          </div>

          {images.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); next() }}
              style={{
                position: 'absolute', right: '12px',
                background: 'none', border: 'none',
                color: 'var(--offwhite)', fontSize: '40px',
                cursor: 'pointer', padding: '16px', zIndex: 10, opacity: 0.6,
              }}
            >›</button>
          )}
        </div>
      )}
    </main>
  )
}