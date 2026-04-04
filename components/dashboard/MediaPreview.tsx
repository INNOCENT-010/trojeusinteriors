'use client'

interface Props {
  url: string
  onRemove: () => void
  size?: 'small' | 'large'
}

const isVideo = (url: string) =>
  url.includes('.mp4') || url.includes('.mov') || url.includes('.webm') ||
  url.includes('video') || url.includes('.avi') || url.includes('.mkv')

export default function MediaPreview({ url, onRemove, size = 'small' }: Props) {
  const w = size === 'large' ? '100%' : '100px'
  const h = size === 'large' ? '200px' : '70px'

  return (
    <div style={{ position: 'relative', width: w, flexShrink: 0 }}>
      {isVideo(url) ? (
        <video
          src={url}
          style={{ width: w, height: h, objectFit: 'cover', display: 'block' }}
          muted
          playsInline
          onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
          onMouseLeave={(e) => {
            const v = e.currentTarget as HTMLVideoElement
            v.pause()
            v.currentTime = 0
          }}
        />
      ) : (
        <img
          src={url}
          alt="preview"
          style={{ width: w, height: h, objectFit: 'cover', display: 'block' }}
        />
      )}

      {/* Video badge */}
      {isVideo(url) && (
        <div
          style={{
            position: 'absolute',
            top: '4px',
            left: '4px',
            background: 'rgba(0,0,0,0.7)',
            padding: '2px 6px',
          }}
        >
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: '8px', color: 'var(--brass)', letterSpacing: '0.1em' }}>
            VIDEO
          </span>
        </div>
      )}

      {/* Remove button */}
      <button
        onClick={onRemove}
        style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          background: 'rgba(0,0,0,0.75)',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          fontSize: '12px',
          width: '22px',
          height: '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1,
        }}
      >
        ×
      </button>

      {/* Hover to play hint for video */}
      {isVideo(url) && (
        <div
          style={{
            position: 'absolute',
            bottom: '4px',
            right: '4px',
            background: 'rgba(0,0,0,0.6)',
            padding: '2px 6px',
          }}
        >
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: '8px', color: 'rgba(255,255,255,0.6)' }}>
            Hover to play
          </span>
        </div>
      )}
    </div>
  )
}