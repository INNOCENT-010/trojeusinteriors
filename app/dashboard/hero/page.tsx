'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ImageUploader from '@/components/dashboard/ImageUploader'
import Image from 'next/image'

const SETTINGS_KEYS = [
  { key: 'hero_headline_line1', label: 'Headline Line 1', placeholder: 'We design' },
  { key: 'hero_headline_line2', label: 'Headline Line 2 (italic / brass)', placeholder: 'spaces' },
  { key: 'hero_headline_line3', label: 'Headline Line 3', placeholder: 'that endure.' },
  { key: 'hero_subtext', label: 'Subtext paragraph', placeholder: 'Bespoke interiors…', textarea: true },
]

function isVideo(url: string) {
  return /\.(mp4|mov|webm|ogg)/i.test(url)
}

export default function DashboardHero() {
  const router = useRouter()
  const [values, setValues] = useState<Record<string, string>>({})
  const [heroImage, setHeroImage] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (sessionStorage.getItem('dashboard_auth') !== 'true') {
      router.push('/dashboard')
      return
    }
    fetchSettings()
  }, [router])

  async function fetchSettings() {
    const { data } = await supabase.from('site_settings').select('key, value')
    if (!data) return
    const map: Record<string, string> = {}
    data.forEach(row => { map[row.key] = row.value ?? '' })
    setValues(map)
    setHeroImage(map['hero_image'] ?? '')
  }

  async function handleSave() {
    setSaving(true)
    setMsg('')
    const allSettings = { ...values, hero_image: heroImage }
    const upserts = Object.entries(allSettings).map(([key, value]) => ({
      key,
      value,
      updated_at: new Date().toISOString(),
    }))
    const { error } = await supabase
      .from('site_settings')
      .upsert(upserts, { onConflict: 'key' })
    setSaving(false)
    setMsg(error ? error.message : 'Hero updated! Redeploy or revalidate to see changes live.')
  }

  const inputStyle = {
    width: '100%',
    background: '#1A1A1A',
    border: '1px solid rgba(184,150,62,0.2)',
    padding: '12px 14px',
    fontFamily: 'var(--font-inter)',
    fontSize: '13px',
    color: 'var(--offwhite)',
    outline: 'none',
    borderRadius: '2px',
    boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    fontFamily: 'var(--font-inter)',
    fontSize: '9px',
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const,
    color: 'var(--brass)',
    display: 'block',
    marginBottom: '8px',
  }

  return (
    <div style={{ maxWidth: '680px' }}>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '9px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--brass)',
            marginBottom: '6px',
          }}
        >
          Dashboard
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '32px',
            fontWeight: 300,
            color: 'var(--offwhite)',
          }}
        >
          Hero Section
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '11px',
            color: 'var(--muted)',
            marginTop: '8px',
            lineHeight: 1.6,
          }}
        >
          Edit the homepage hero background and headline text. Supports both images and videos.
        </p>
      </div>

      {/* Hero media */}
      <div style={{ marginBottom: '32px' }}>
        <label style={labelStyle}>Hero Background Image / Video</label>

        {heroImage && (
          <div
            style={{
              position: 'relative',
              height: '200px',
              marginBottom: '12px',
              overflow: 'hidden',
            }}
          >
            {isVideo(heroImage) ? (
              <video
                src={heroImage}
                autoPlay
                muted
                loop
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Image
                src={heroImage}
                alt="Hero"
                fill
                style={{ objectFit: 'cover' }}
              />
            )}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)',
                pointerEvents: 'none',
              }}
            />
            <p
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '14px',
                fontFamily: 'var(--font-inter)',
                fontSize: '9px',
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: '0.1em',
              }}
            >
              {isVideo(heroImage) ? 'Current hero · video' : 'Current hero · image'}
            </p>
          </div>
        )}

        <ImageUploader
          bucket="media"
          label="Replace Hero Image / Video"
          accept="image/*,video/*"
          onUpload={url => setHeroImage(url)}
        />
      </div>

      {/* Text fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
        {SETTINGS_KEYS.map(({ key, label, placeholder, textarea }) => (
          <div key={key}>
            <label style={labelStyle}>{label}</label>
            {textarea ? (
              <textarea
                style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }}
                value={values[key] ?? ''}
                onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
                placeholder={placeholder}
              />
            ) : (
              <input
                style={inputStyle}
                value={values[key] ?? ''}
                onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
                placeholder={placeholder}
              />
            )}
          </div>
        ))}
      </div>

      {/* Live preview */}
      <div
        style={{
          background: '#111',
          border: '1px solid rgba(184,150,62,0.1)',
          padding: '32px',
          marginBottom: '28px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background preview */}
        {heroImage && (
          <div style={{ position: 'absolute', inset: 0, opacity: 0.15 }}>
            {isVideo(heroImage) ? (
              <video
                src={heroImage}
                autoPlay
                muted
                loop
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Image src={heroImage} alt="" fill style={{ objectFit: 'cover' }} />
            )}
          </div>
        )}

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '8px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--brass)',
              marginBottom: '20px',
              opacity: 0.5,
            }}
          >
            Preview
          </p>
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
            Lagos · Nigeria
          </p>
          <div
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '36px',
              fontWeight: 300,
              lineHeight: 1,
              color: 'var(--offwhite)',
              marginBottom: '16px',
            }}
          >
            {values['hero_headline_line1'] || 'We design'}
            <br />
            <em style={{ fontStyle: 'italic', color: 'var(--brass-light)' }}>
              {values['hero_headline_line2'] || 'spaces'}
            </em>
            <br />
            {values['hero_headline_line3'] || 'that endure.'}
          </div>
          <p
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '11px',
              color: 'rgba(244,239,232,0.55)',
              lineHeight: 1.7,
              maxWidth: '340px',
            }}
          >
            {values['hero_subtext'] || 'Bespoke interiors…'}
          </p>
        </div>
      </div>

      {msg && (
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '12px',
            color: msg.startsWith('Hero updated') ? '#4caf50' : '#c0392b',
            marginBottom: '16px',
          }}
        >
          {msg}
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-brass-filled"
        style={{ fontSize: '10px', padding: '14px 32px' }}
      >
        {saving ? 'Saving…' : 'Save Hero Settings'}
      </button>
    </div>
  )
}