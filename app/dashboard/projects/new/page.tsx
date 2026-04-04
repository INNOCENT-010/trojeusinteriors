'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ImageUploader from '@/components/dashboard/ImageUploader'

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

export default function NewProject() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: 'residential',
    description: '',
    location: '',
    year: new Date().getFullYear(),
    cover_image: '',
    images: [] as string[],
    featured: false,
    render_type: 'photography',
    status: 'draft',
  })

  const set = (key: string, value: unknown) => setForm((p) => ({ ...p, [key]: value }))

  const handleTitleChange = (val: string) => {
    set('title', val)
    set('slug', val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
  }

  const handleSave = async () => {
    if (!form.title || !form.slug) return
    setSaving(true)
    const { error } = await supabase.from('projects').insert([form])
    setSaving(false)
    if (!error) router.push('/dashboard/projects')
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--brass)', marginBottom: '6px' }}>
          Projects
        </p>
        <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '40px', fontWeight: 300, color: 'var(--offwhite)' }}>
          New Project
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <label style={labelStyle}>Title *</label>
            <input style={inputStyle} value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Project title" />
          </div>
          <div>
            <label style={labelStyle}>Slug *</label>
            <input style={inputStyle} value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="project-slug" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
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
            <input style={inputStyle} value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="Lagos, Nigeria" />
          </div>
          <div>
            <label style={labelStyle}>Year</label>
            <input style={inputStyle} type="number" value={form.year} onChange={(e) => set('year', parseInt(e.target.value))} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
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
            placeholder="Describe the project, the brief, the outcome..."
          />
        </div>

        <div>
          <label style={labelStyle}>Cover Image</label>
          {form.cover_image ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img src={form.cover_image} alt="cover" style={{ width: '120px', height: '80px', objectFit: 'cover' }} />
              <button onClick={() => set('cover_image', '')} style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontFamily: 'var(--font-inter)', fontSize: '10px' }}>Remove</button>
            </div>
          ) : (
            <ImageUploader bucket="project-images" onUpload={(url) => set('cover_image', url)} label="Upload Cover Image" />
          )}
        </div>

        <div>
          <label style={labelStyle}>Gallery Images</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            {form.images.map((img, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <img src={img} alt={`gallery-${i}`} style={{ width: '100px', height: '70px', objectFit: 'cover' }} />
                <button
                  onClick={() => set('images', form.images.filter((_, idx) => idx !== i))}
                  style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '10px', width: '18px', height: '18px' }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <ImageUploader bucket="project-images" onUpload={(url) => set('images', [...form.images, url])} label="Add Gallery Image" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input
            type="checkbox"
            id="featured"
            checked={form.featured}
            onChange={(e) => set('featured', e.target.checked)}
            style={{ accentColor: 'var(--brass)', width: '16px', height: '16px' }}
          />
          <label htmlFor="featured" style={{ ...labelStyle, marginBottom: 0 }}>Feature on homepage</label>
        </div>

        <div style={{ display: 'flex', gap: '16px', paddingTop: '16px', borderTop: '1px solid rgba(184,150,62,0.1)' }}>
          <button onClick={handleSave} disabled={saving} className="btn-brass-filled" style={{ fontSize: '10px', opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Saving...' : 'Save Project'}
          </button>
          <button onClick={() => router.push('/dashboard/projects')} className="btn-brass" style={{ fontSize: '10px' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}