'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'

interface Props {
  images: string[]
  title: string
}

function isVideo(url: string) {
  return /\.(mp4|webm|ogg|mov)$/i.test(url) || url.includes('video')
}

export default function ProjectGallery({ images, title }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const touchStartX = useRef<number | null>(null)

  const open = (i: number) => setLightboxIndex(i)
  const close = () => setLightboxIndex(null)

  const prev = useCallback(() => {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex - 1 + images.length) % images.length)
  }, [lightboxIndex, images.length])

  const next = useCallback(() => {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex + 1) % images.length)
  }, [lightboxIndex, images.length])

  useEffect(() => {
    if (lightboxIndex === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxIndex, prev, next])

  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxIndex])

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev()
    touchStartX.current = null
  }

  return (
    <>
      {/* Gallery grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {images[0] && (
          <div
            onClick={() => open(0)}
            style={{
              position: 'relative',
              aspectRatio: isVideo(images[0]) ? '16/9' : '16/9',
              width: '100%',
              overflow: 'hidden',
              cursor: 'zoom-in',
              background: '#111',
            }}
          >
            {isVideo(images[0]) ? (
              <>
                <video
                  src={images[0]}
                  muted
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(0,0,0,0.3)',
                }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '50%',
                    border: '1px solid var(--brass)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ color: 'var(--brass)', fontSize: '20px', marginLeft: '4px' }}>▶</span>
                  </div>
                </div>
              </>
            ) : (
              <Image
                src={images[0]}
                alt={`${title} — 1`}
                fill
                style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }}
                onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
              />
            )}
          </div>
        )}

        {images.length > 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2px' }}>
            {images.slice(1).map((src, i) => (
              <div
                key={i}
                onClick={() => open(i + 1)}
                style={{
                  position: 'relative',
                  aspectRatio: '4/3',
                  overflow: 'hidden',
                  cursor: 'zoom-in',
                  background: '#111',
                }}
              >
                {isVideo(src) ? (
                  <>
                    <video
                      src={src}
                      muted
                      playsInline
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute', inset: 0, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(0,0,0,0.3)',
                    }}>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '50%',
                        border: '1px solid var(--brass)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{ color: 'var(--brass)', fontSize: '16px', marginLeft: '3px' }}>▶</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <Image
                    src={src}
                    alt={`${title} — ${i + 2}`}
                    fill
                    style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }}
                    onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                    onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          onClick={close}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(8,8,8,0.98)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Counter */}
          <p style={{
            position: 'absolute', top: '20px', left: '20px',
            fontFamily: 'var(--font-inter)', fontSize: '10px',
            letterSpacing: '0.15em', color: 'var(--brass)', zIndex: 10,
          }}>
            {lightboxIndex + 1} / {images.length}
          </p>

          {/* Close */}
          <button
            onClick={close}
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

          {/* Prev */}
          {images.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); prev() }}
              style={{
                position: 'absolute', left: '12px',
                background: 'none', border: 'none',
                color: 'var(--offwhite)', fontSize: '40px',
                cursor: 'pointer', padding: '16px',
                zIndex: 10, opacity: 0.6,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
            >
              ‹
            </button>
          )}

          {/* Media */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '92vw',
              height: '88vh',
              maxWidth: '1200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isVideo(images[lightboxIndex]) ? (
              <video
                src={images[lightboxIndex]}
                controls
                autoPlay
                playsInline
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  outline: 'none',
                }}
              />
            ) : (
              <Image
                src={images[lightboxIndex]}
                alt={`${title} — ${lightboxIndex + 1}`}
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            )}
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); next() }}
              style={{
                position: 'absolute', right: '12px',
                background: 'none', border: 'none',
                color: 'var(--offwhite)', fontSize: '40px',
                cursor: 'pointer', padding: '16px',
                zIndex: 10, opacity: 0.6,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  )
}