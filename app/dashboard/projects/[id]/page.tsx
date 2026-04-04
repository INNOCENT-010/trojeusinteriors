'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ImageUploader from '@/components/dashboard/ImageUploader'
import MediaPreview from '@/components/dashboard/MediaPreview'

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#1A1A1A',
  border: '1px solid rgba(184,150,62,0.2)',
  padding: '12px 16px',
  fontFamily: 'var(--font-inter)',
  fontSize: '13px',
  color: 'var(--offwhite)',
  outline: 'none',
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-inter)',
  fontSize: '9px',
  letterSpacing: '0.2em',
  textTransform: 'uppercase' as const,
  color: 'var(--brass)',
  display: 'block',
  marginBottom: '8px',
}

export default function EditProject() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<any>(null)

  useEffect(() => {
    if (sessionStorage.getItem('dashboard_auth') !== 'true') {
      router.push('/dashboard')
      return
    }
    supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setForm(data)
        setLoading(false)
      })
  }, [id])

  const set = (key: string, value: unknown) => setForm((p: any) => ({ ...p, [key]: value }))

  const handleSave = async () => {
    if (!form.title || !form.slug) return
    setSaving(true)
    await supabase.from('projects').update(form).eq('id', id)
    setSaving(false)
    router.push('/dashboard/projects')
  }

  if (loading) return (
    <p style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: 'var(--muted)', padding: '40px 0' }}>
      Loading...
    </p>
  )
  if (!form) return (
    <p style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: 'var(--muted)', padding: '40px 0' }}>
      Project not found
    </p>
  )

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--brass)', marginBottom: '6px' }}>
          Projects / Edit
        </p>
        <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 300, color: 'var(--offwhite)' }}>
          {form.title}
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
          <div>
            <label style={labelStyle}>Title *</label>
            <input style={inputStyle} value={form.title} onChange={(e) => set('title', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Slug *</label>
            <input style={inputStyle} value={form.slug} onChange={(e) => set('slug', e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '24px' }}>
          <div>
            <label style={labelStyle}>Category</label>
            <select style={inputStyle} value={form.category} onChange={(e) => set('category', e.target.value)}>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="hospitality">Hospitality</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Location</label>
            <input style={inputStyle} value={form.location} onChange={(e) => set('location', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Year</label>
            <input style={inputStyle} type="number" value={form.year} onChange={(e) => set('year', parseInt(e.target.value))} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '24px' }}>
          <div>
            <label style={labelStyle}>Render type</label>
            <select style={inputStyle} value={form.render_type} onChange={(e) => set('render_type', e.target.value)}>
              <option value="photography">Photography</option>
              <option value="3d-render">3D Render</option>
              <option value="both">Both</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select style={inputStyle} value={form.status} onChange={(e) => set('status', e.target.value)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Description</label>
          <textarea
            style={{ ...inputStyle, resize: 'none', lineHeight: 1.8 }}
            rows={5}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
          />
        </div>

        <div>
          <label style={labelStyle}>Cover Image / Video</label>
          {form.cover_image ? (
            <MediaPreview
              url={form.cover_image}
              onRemove={() => set('cover_image', '')}
              size="large"
            />
          ) : (
            <ImageUploader
              bucket="project-images"
              onUpload={(url) => set('cover_image', url)}
              label="Upload Cover Image or Video"
            />
          )}
        </div>

        <div>
          <label style={labelStyle}>Gallery — Images & Videos</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            {(form.images ?? []).map((url: string, i: number) => (
              <MediaPreview
                key={i}
                url={url}
                onRemove={() => set('images', form.images.filter((_: string, idx: number) => idx !== i))}
              />
            ))}
          </div>
          <ImageUploader
            bucket="project-images"
            onUpload={(url) => set('images', [...(form.images ?? []), url])}
            label="+ Add Image or Video"
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input
            type="checkbox"
            id="featured"
            checked={form.featured}
            onChange={(e) => set('featured', e.target.checked)}
            style={{ accentColor: 'var(--brass)', width: '16px', height: '16px' }}
          />
          <label htmlFor="featured" style={{ ...labelStyle, marginBottom: 0 }}>
            Feature on homepage
          </label>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', paddingTop: '16px', borderTop: '1px solid rgba(184,150,62,0.1)' }}>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-brass-filled"
            style={{ fontSize: '10px', opacity: saving ? 0.6 : 1 }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={() => router.push('/dashboard/projects')}
            className="btn-brass"
            style={{ fontSize: '10px' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}