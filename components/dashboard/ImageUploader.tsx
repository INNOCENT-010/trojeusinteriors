'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Props {
  bucket: 'project-images' | 'product-images'
  onUpload: (url: string) => void
  label?: string
  acceptVideo?: boolean
}

export default function ImageUploader({
  bucket,
  onUpload,
  label = 'Upload Image',
  acceptVideo = false,
}: Props) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState('')

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)

    const isVideo = file.type.startsWith('video/')
    setProgress(isVideo ? 'Uploading video...' : 'Uploading...')

    const ext = file.name.split('.').pop()
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error } = await supabase.storage.from(bucket).upload(filename, file, {
      cacheControl: '3600',
      upsert: false,
    })

    if (error) {
      console.error(error)
      setProgress('')
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filename)
    onUpload(data.publicUrl)
    setProgress('')
    setUploading(false)

    // Reset input so same file can be re-uploaded if needed
    e.target.value = ''
  }

  const accept = acceptVideo
    ? 'image/*,video/mp4,video/webm,video/ogg,video/quicktime'
    : 'image/*'

  return (
    <label style={{
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      padding: '10px 20px',
      border: '1px solid rgba(184,150,62,0.3)',
      color: 'var(--brass)', fontFamily: 'var(--font-inter)',
      fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase',
      cursor: uploading ? 'not-allowed' : 'pointer',
      opacity: uploading ? 0.6 : 1,
      transition: 'all 0.3s ease',
    }}>
      {uploading ? progress || 'Uploading...' : label}
      <input
        type="file"
        accept={accept}
        onChange={handleUpload}
        style={{ display: 'none' }}
        disabled={uploading}
      />
    </label>
  )
}