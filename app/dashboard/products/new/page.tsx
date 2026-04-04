'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ImageUploader from '@/components/dashboard/ImageUploader'

const inputStyle: React.CSSProperties = { width: '100%', background: '#1A1A1A', border: '1px solid rgba(184,150,62,0.2)', padding: '12px 16px', fontFamily: 'var(--font-inter)', fontSize: '13px', color: 'var(--offwhite)', outline: 'none' }
const labelStyle: React.CSSProperties = { fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'var(--brass)', display: 'block', marginBottom: '8px' }

function isVideo(url: string) {
  return /\.(mp4|webm|ogg|mov)$/i.test(url)
}

function MediaThumb({ url, onRemove }: { url: string; onRemove: () => void }) {
  return (
    <div style={{ position: 'relative' }}>
      {isVideo(url) ? (
        <div style={{ width: '100px', height: '70px', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(184,150,62,0.2)' }}>
          <span style={{ color: 'var(--brass)', fontSize: '20px' }}>▶</span>
        </div>
      ) : (
        <img src={url} alt="" style={{ width: '100px', height: '70px', objectFit: 'cover', display: 'block' }} />
      )}
      <button onClick={onRemove} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.8)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '10px', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
    </div>
  )
}

export default function NewProduct() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [form, setForm] = useState({
    title: '', slug: '', category: '', description: '',
    images: [] as string[], featured: false, status: 'draft',
  })

  useEffect(() => {
    if (sessionStorage.getItem('dashboard_auth') !== 'true') { router.push('/dashboard'); return }
    supabase.from('categories').select('name').eq('type', 'product').order('name')
      .then(({ data }) => {
        const cats = data?.map(c => c.name) ?? []
        setCategories(cats)
        if (cats.length > 0) setForm(p => ({ ...p, category: cats[0] }))
      })
  }, [])

  const set = (key: string, value: unknown) => setForm(p => ({ ...p, [key]: value }))

  const handleTitleChange = (val: string) => {
    set('title', val)
    set('slug', val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
  }

  const handleSave = async () => {
    if (!form.title || !form.slug) return
    setSaving(true)
    const { error } = await supabase.from('product_designs').insert([form])
    setSaving(false)
    if (!error) router.push('/dashboard/products')
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--brass)', marginBottom: '6px' }}>Product Design</p>
        <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(28px,5vw,40px)', fontWeight: 300, color: 'var(--offwhite)' }}>New Product</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '24px' }}>
          <div><label style={labelStyle}>Title *</label><input style={inputStyle} value={form.title} onChange={e => handleTitleChange(e.target.value)} placeholder="Product title" /></div>
          <div><label style={labelStyle}>Slug *</label><input style={inputStyle} value={form.slug} onChange={e => set('slug', e.target.value)} /></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '24px' }}>
          <div>
            <label style={labelStyle}>Category</label>
            <select style={inputStyle} value={form.category} onChange={e => set('category', e.target.value)}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select style={inputStyle} value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Description</label>
          <textarea style={{ ...inputStyle, resize: 'none', lineHeight: 1.8 }} rows={4} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe this piece..." />
        </div>

        <div>
          <label style={labelStyle}>Images & Videos</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            {form.images.map((url, i) => (
              <MediaThumb key={i} url={url} onRemove={() => set('images', form.images.filter((_, idx) => idx !== i))} />
            ))}
          </div>
          <ImageUploader bucket="product-images" onUpload={url => set('images', [...form.images, url])} label="+ Add Image or Video" acceptVideo />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input type="checkbox" id="featured" checked={form.featured} onChange={e => set('featured', e.target.checked)} style={{ accentColor: 'var(--brass)', width: '16px', height: '16px' }} />
          <label htmlFor="featured" style={{ ...labelStyle, marginBottom: 0 }}>Feature on homepage</label>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', paddingTop: '16px', borderTop: '1px solid rgba(184,150,62,0.1)' }}>
          <button onClick={handleSave} disabled={saving} className="btn-brass-filled" style={{ fontSize: '10px', opacity: saving ? 0.6 : 1 }}>{saving ? 'Saving...' : 'Save Product'}</button>
          <button onClick={() => router.push('/dashboard/products')} className="btn-brass" style={{ fontSize: '10px' }}>Cancel</button>
        </div>
      </div>
    </div>
  )
}