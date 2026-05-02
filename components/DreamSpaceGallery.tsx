'use client'

import { useState } from 'react'
import Image from 'next/image'

function isVideo(url: string) {
  return /\.(mp4|mov|webm|ogg)/i.test(url)
}

export default function DreamSpaceGallery({
  images,
  title,
}: {
  images: string[]
  title: string
}) {
  const [lightbox, setLightbox] = useState<string | null>(null)

  if (images.length === 0) return null

  return (
    <>
      <section style={{ padding: '0 40px 120px', maxWidth: '1200px', margin: '0 auto' }}>
        <p className="overline" style={{ marginBottom: '32px' }}>Gallery</p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '2px',
          }}
        >
          {images.map((url, idx) => (
            <div
              key={idx}
              onClick={() => setLightbox(url)}
              style={{
                position: 'relative',
                aspectRatio: '4/3',
                background: 'var(--charcoal-light)',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
            >
              {isVideo(url) ? (
                <>
                  <video
                    src={url}
                    muted
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* Play icon overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(17,17,17,0.3)',
                      transition: 'background 0.2s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        border: '1px solid rgba(244,239,232,0.6)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: 0,
                          height: 0,
                          borderTop: '8px solid transparent',
                          borderBottom: '8px solid transparent',
                          borderLeft: '14px solid rgba(244,239,232,0.9)',
                          marginLeft: '3px',
                        }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Image
                    src={url}
                    alt={`${title} ${idx + 2}`}
                    fill
                    style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  />
                  {/* Zoom icon overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(17,17,17,0)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.3s ease',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(17,17,17,0.35)'
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(17,17,17,0)'
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '9px',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'var(--offwhite)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.opacity = '1'
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.opacity = '0'
                      }}
                    >
                      View
                    </span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(10,10,10,0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'none',
              border: '1px solid rgba(244,239,232,0.2)',
              color: 'var(--offwhite)',
              fontFamily: 'var(--font-inter)',
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '8px 16px',
              cursor: 'pointer',
            }}
          >
            Close ×
          </button>

          {/* Media */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '88vh',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isVideo(lightbox) ? (
              <video
                src={lightbox}
                controls
                autoPlay
                playsInline
                style={{
                  maxWidth: '100%',
                  maxHeight: '88vh',
                  outline: 'none',
                }}
              />
            ) : (
              <div style={{ position: 'relative', width: '90vw', height: '85vh' }}>
                <Image
                  src={lightbox}
                  alt="Gallery image"
                  fill
                  style={{ objectFit: 'contain' }}
                  sizes="90vw"
                />
              </div>
            )}
          </div>

          {/* Navigation — prev/next */}
          {images.length > 1 && (() => {
            const gallery = images
            const currentIdx = gallery.indexOf(lightbox)
            const prev = gallery[currentIdx - 1]
            const next = gallery[currentIdx + 1]
            return (
              <>
                {prev && (
                  <button
                    onClick={e => { e.stopPropagation(); setLightbox(prev) }}
                    style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: '1px solid rgba(244,239,232,0.2)',
                      color: 'var(--offwhite)',
                      fontSize: '18px',
                      width: '44px',
                      height: '44px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    ‹
                  </button>
                )}
                {next && (
                  <button
                    onClick={e => { e.stopPropagation(); setLightbox(next) }}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: '1px solid rgba(244,239,232,0.2)',
                      color: 'var(--offwhite)',
                      fontSize: '18px',
                      width: '44px',
                      height: '44px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    ›
                  </button>
                )}
                <p
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '9px',
                    letterSpacing: '0.2em',
                    color: 'rgba(244,239,232,0.4)',
                    textTransform: 'uppercase',
                  }}
                >
                  {currentIdx + 1} / {gallery.length}
                </p>
              </>
            )
          })()}
        </div>
      )}
    </>
  )
}