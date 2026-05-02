'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ImageUploader from '@/components/dashboard/ImageUploader'
import Image from 'next/image'
import type { DreamSpace } from '@/types'

const CATEGORIES = ['kitchen', 'bedroom', 'living-room']
const LABELS: Record<string, string> = { kitchen: 'Kitchen', bedroom: 'Bedroom', 'living-room': 'Living Room' }

const EMPTY: Omit<DreamSpace, 'id' | 'created_at'> = {
  title: '',
  slug: '',
  description: '' as string | null,
  category: 'bedroom',
  images: [] as string[],
  related_project_slug: '' as string | null,
  featured: false,
  sort_order: 0,
  status: 'draft',
}

export default function DashboardDreamSpaces() {
  const router = useRouter()
  const [spaces, setSpaces] = useState<DreamSpace[]>([])
  const [form, setForm] = useState({ ...EMPTY })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [msg, setMsg] = useState('')
  const [tab, setTab] = useState<'list' | 'edit'>('list')

  useEffect(() => {
    if (sessionStorage.getItem('dashboard_auth') !== 'true') {
      router.push('/dashboard')
      return
    }
    fetchSpaces()
  }, [router])

  async function fetchSpaces() {
    const { data } = await supabase
      .from('dream_spaces')
      .select('*')
      .order('sort_order', { ascending: true })
    setSpaces(data ?? [])
  }

  function autoSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  function handleEdit(space: DreamSpace) {
    setForm({
      title: space.title,
      slug: space.slug,
      description: space.description ?? '',
      category: space.category,
      images: space.images ?? [],
      related_project_slug: space.related_project_slug ?? '',
      featured: space.featured,
      sort_order: space.sort_order,
      status: space.status,
    })
    setEditingId(space.id)
    setTab('edit')
  }

  function handleNew() {
    setForm({ ...EMPTY })
    setEditingId(null)
    setTab('edit')
  }

  async function handleSave() {
    if (!form.title.trim()) { setMsg('Title is required.'); return }
    setSaving(true)
    setMsg('')
    const payload = {
      ...form,
      slug: form.slug || autoSlug(form.title),
      related_project_slug: form.related_project_slug || null,
    }
    const { error } = editingId
      ? await supabase.from('dream_spaces').update(payload).eq('id', editingId)
      : await supabase.from('dream_spaces').insert([payload])
    setSaving(false)
    if (error) { setMsg(error.message); return }
    setMsg(editingId ? 'Updated!' : 'Created!')
    fetchSpaces()
    setTimeout(() => { setMsg(''); setTab('list') }, 1200)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this dream space?')) return
    setDeleting(id)
    await supabase.from('dream_spaces').delete().eq('id', id)
    setDeleting(null)
    fetchSpaces()
  }

  function removeImage(idx: number) {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))
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
    <div>
      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--brass)', marginBottom: '6px' }}>Dashboard</p>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '32px', fontWeight: 300, color: 'var(--offwhite)' }}>Dream Spaces</h1>
        </div>
        {tab === 'list' && (
          <button onClick={handleNew} className="btn-brass" style={{ fontSize: '9px', padding: '10px 20px' }}>
            + New Space
          </button>
        )}
        {tab === 'edit' && (
          <button
            onClick={() => { setTab('list'); setMsg('') }}
            style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            ← Back to list
          </button>
        )}
      </div>

      {/* LIST TAB */}
      {tab === 'list' && (
        <div>
          {CATEGORIES.map(cat => {
            const catSpaces = spaces.filter(s => s.category === cat)
            return (
              <div key={cat} style={{ marginBottom: '48px' }}>
                <p style={{ ...labelStyle, marginBottom: '16px' }}>{LABELS[cat]} — {catSpaces.length} entries</p>
                {catSpaces.length === 0 ? (
                  <div style={{ border: '1px dashed rgba(184,150,62,0.15)', padding: '32px', textAlign: 'center' }}>
                    <p style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: 'var(--muted)' }}>No {LABELS[cat]} spaces yet.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2px' }}>
                    {catSpaces.map(space => (
                      <div
                        key={space.id}
                        style={{ background: '#1A1A1A', border: '1px solid rgba(184,150,62,0.1)', padding: '16px', position: 'relative' }}
                      >
                        {space.images[0] && (
                          <div style={{ position: 'relative', height: '140px', marginBottom: '12px', overflow: 'hidden' }}>
                            <Image src={space.images[0]} alt={space.title} fill style={{ objectFit: 'cover' }} />
                          </div>
                        )}
                        <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '18px', color: 'var(--offwhite)', marginBottom: '4px' }}>{space.title}</p>
                        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.1em', color: space.status === 'published' ? '#4caf50' : 'var(--muted)', textTransform: 'uppercase', marginBottom: '12px' }}>{space.status}</p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleEdit(space)}
                            style={{ flex: 1, fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--brass)', background: 'none', border: '1px solid rgba(184,150,62,0.3)', padding: '8px', cursor: 'pointer' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(space.id)}
                            disabled={deleting === space.id}
                            style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c0392b', background: 'none', border: '1px solid rgba(192,57,43,0.3)', padding: '8px 12px', cursor: 'pointer' }}
                          >
                            {deleting === space.id ? '…' : 'Del'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* EDIT TAB */}
      {tab === 'edit' && (
        <div style={{ maxWidth: '680px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Title</label>
              <input
                style={inputStyle}
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: autoSlug(e.target.value) }))}
                placeholder="e.g. Soft Ivory Bedroom"
              />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select
                style={{ ...inputStyle }}
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{LABELS[cat]}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Slug</label>
            <input
              style={inputStyle}
              value={form.slug}
              onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
              placeholder="auto-generated from title"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Description</label>
            <textarea
              style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
              value={form.description ?? ''}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Describe this space..."
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Related Project Slug</label>
            <input
              style={inputStyle}
              value={form.related_project_slug ?? ''}
              onChange={e => setForm(f => ({ ...f, related_project_slug: e.target.value }))}
              placeholder="e.g. lekki-penthouse (must match a project slug)"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div>
              <label style={labelStyle}>Status</label>
              <select style={inputStyle} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Sort Order</label>
              <input
                style={inputStyle}
                type="number"
                value={form.sort_order}
                onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                  style={{ accentColor: 'var(--brass)', width: '14px', height: '14px' }}
                />
                Featured
              </label>
            </div>
          </div>

          {/* Images */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Images ({form.images.length})</label>
            {form.images.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {form.images.map((url, idx) => (
                  <div key={idx} style={{ position: 'relative', width: '100px', height: '80px' }}>
                    <Image src={url} alt="" fill style={{ objectFit: 'cover' }} />
                    <button
                      onClick={() => removeImage(idx)}
                      style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', fontSize: '11px', width: '20px', height: '20px', cursor: 'pointer', borderRadius: '2px' }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <ImageUploader
              bucket="media"
              label="Upload Image / Video"
              onUpload={url => setForm(f => ({ ...f, images: [...f.images, url] }))}
            />
          </div>

          {msg && (
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: msg.includes('!') ? '#4caf50' : '#c0392b', marginBottom: '16px' }}>
              {msg}
            </p>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-brass-filled"
            style={{ fontSize: '10px', padding: '14px 32px' }}
          >
            {saving ? 'Saving…' : editingId ? 'Update Space' : 'Create Space'}
          </button>
        </div>
      )}
    </div>
  )
}