'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface Props {
  bucket: string
  onUpload: (url: string) => void
  label?: string
  accept?: string
}

export default function ImageUploader({ bucket, onUpload, label = 'Upload File', accept = 'image/*,video/*' }: Props) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      setError('File too large. Max 100MB.')
      return
    }

    setUploading(true)
    setError('')
    setProgress(10)

    const ext = file.name.split('.').pop()
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    setProgress(40)

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      setProgress(0)
      return
    }

    setProgress(90)

    const { data } = supabase.storage.from(bucket).getPublicUrl(filename)
    onUpload(data.publicUrl)

    setProgress(100)
    setTimeout(() => {
      setUploading(false)
      setProgress(0)
    }, 600)

    // Reset input so same file can be re-uploaded if needed
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        style={{
          border: '1px dashed rgba(184,150,62,0.3)',
          padding: '20px',
          textAlign: 'center',
          cursor: uploading ? 'not-allowed' : 'pointer',
          transition: 'border-color 0.3s ease',
          background: 'rgba(184,150,62,0.03)',
        }}
        onMouseEnter={(e) => {
          if (!uploading) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(184,150,62,0.6)'
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(184,150,62,0.3)'
        }}
      >
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: uploading ? 'var(--muted)' : 'var(--brass)', marginBottom: '6px' }}>
          {uploading ? `Uploading... ${progress}%` : label}
        </p>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: 'var(--muted)' }}>
          Images or videos · Max 100MB
        </p>

        {/* Progress bar */}
        {uploading && (
          <div style={{ marginTop: '12px', background: 'rgba(184,150,62,0.1)', height: '2px', borderRadius: '1px' }}>
            <div
              style={{
                height: '100%',
                background: 'var(--brass)',
                width: `${progress}%`,
                transition: 'width 0.3s ease',
                borderRadius: '1px',
              }}
            />
          </div>
        )}
      </div>

      {error && (
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: '#c0392b', marginTop: '8px' }}>
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleUpload}
        style={{ display: 'none' }}
        disabled={uploading}
      />
    </div>
  )
}