'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Category {
  id: string
  name: string
  slug: string
  type: string
  created_at: string
}

export default function DashboardCategories() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', type: 'product' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (sessionStorage.getItem('dashboard_auth') !== 'true') {
      router.push('/dashboard')
      return
    }
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('type')
      .order('name')
    setCategories(data ?? [])
    setLoading(false)
  }

  const handleAdd = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    setError('')

    const slug = form.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const { error: err } = await supabase
      .from('categories')
      .insert([{ name: form.name.trim(), slug, type: form.type }])

    if (err) {
      setError(err.message.includes('unique') ? 'That category already exists.' : err.message)
    } else {
      setForm({ name: '', type: 'product' })
      fetchCategories()
    }
    setSaving(false)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This won't delete existing items using this category.`)) return
    await supabase.from('categories').delete().eq('id', id)
    fetchCategories()
  }

  const productCats = categories.filter((c) => c.type === 'product')
  const projectCats = categories.filter((c) => c.type === 'project')

  const inputStyle: React.CSSProperties = {
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
    textTransform: 'uppercase',
    color: 'var(--brass)',
    display: 'block',
    marginBottom: '8px',
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '48px' }}>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--brass)', marginBottom: '6px' }}>
          Dashboard
        </p>
        <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '40px', fontWeight: 300, color: 'var(--offwhite)' }}>
          Categories
        </h1>
      </div>

      {/* Add new category */}
      <div
        style={{
          padding: '32px',
          background: '#1A1A1A',
          border: '1px solid rgba(184,150,62,0.12)',
          marginBottom: '48px',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '22px',
            fontWeight: 400,
            color: 'var(--offwhite)',
            marginBottom: '24px',
          }}
        >
          Add new category
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Category name</label>
            <input
              style={{ ...inputStyle, width: '100%' }}
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="e.g. Rugs, Mirrors, Office..."
            />
          </div>
          <div>
            <label style={labelStyle}>Applies to</label>
            <select
              style={{ ...inputStyle, width: '100%', cursor: 'pointer' }}
              value={form.type}
              onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
            >
              <option value="product">Product Design</option>
              <option value="project">Projects</option>
            </select>
          </div>
        </div>

        {error && (
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: '#c0392b', marginBottom: '12px' }}>
            {error}
          </p>
        )}

        {form.name && (
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: 'var(--muted)', marginBottom: '16px', letterSpacing: '0.05em' }}>
            Slug: <span style={{ color: 'var(--brass)' }}>{form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}</span>
          </p>
        )}

        <button
          onClick={handleAdd}
          disabled={saving || !form.name.trim()}
          className="btn-brass"
          style={{ fontSize: '10px', opacity: saving || !form.name.trim() ? 0.5 : 1 }}
        >
          {saving ? 'Adding...' : '+ Add Category'}
        </button>
      </div>

      {loading ? (
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: 'var(--muted)' }}>Loading...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

          {/* Product categories */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--brass)' }}>
                Product Design
              </p>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: 'var(--muted)' }}>
                {productCats.length} categories
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {productCats.map((cat) => (
                <div
                  key={cat.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 20px',
                    background: '#141414',
                    borderLeft: '2px solid rgba(184,150,62,0.2)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '20px', fontWeight: 400, color: 'var(--offwhite)' }}>
                      {cat.name}
                    </p>
                    <p style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.05em' }}>
                      /{cat.slug}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontFamily: 'var(--font-inter)',
                      fontSize: '10px',
                      color: '#c0392b',
                      cursor: 'pointer',
                      letterSpacing: '0.1em',
                      padding: 0,
                      opacity: 0.6,
                      transition: 'opacity 0.2s ease',
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.6')}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Project categories */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--brass)' }}>
                Projects
              </p>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: 'var(--muted)' }}>
                {projectCats.length} categories
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {projectCats.map((cat) => (
                <div
                  key={cat.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 20px',
                    background: '#141414',
                    borderLeft: '2px solid rgba(184,150,62,0.2)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '20px', fontWeight: 400, color: 'var(--offwhite)' }}>
                      {cat.name}
                    </p>
                    <p style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.05em' }}>
                      /{cat.slug}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontFamily: 'var(--font-inter)',
                      fontSize: '10px',
                      color: '#c0392b',
                      cursor: 'pointer',
                      letterSpacing: '0.1em',
                      padding: 0,
                      opacity: 0.6,
                      transition: 'opacity 0.2s ease',
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.6')}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}