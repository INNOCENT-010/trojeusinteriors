'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function DashboardProducts() {
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionStorage.getItem('dashboard_auth') !== 'true') { router.push('/dashboard'); return }
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data } = await supabase.from('product_designs').select('*').order('created_at', { ascending: false })
    setProducts(data ?? [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return
    await supabase.from('product_designs').delete().eq('id', id)
    fetchProducts()
  }

  const toggleStatus = async (id: string, current: string) => {
    await supabase.from('product_designs').update({ status: current === 'published' ? 'draft' : 'published' }).eq('id', id)
    fetchProducts()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--brass)', marginBottom: '6px' }}>Dashboard</p>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '40px', fontWeight: 300, color: 'var(--offwhite)' }}>Product Design</h1>
        </div>
        <Link href="/dashboard/products/new" className="btn-brass" style={{ fontSize: '10px' }}>+ New Product</Link>
      </div>

      {loading ? (
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: 'var(--muted)' }}>Loading...</p>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', border: '1px solid rgba(184,150,62,0.1)' }}>
          <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '24px', color: 'var(--muted)' }}>No products yet</p>
          <Link href="/dashboard/products/new" style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: 'var(--brass)', textDecoration: 'none', letterSpacing: '0.15em', display: 'block', marginTop: '16px' }}>Create your first product →</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px 120px', gap: '16px', padding: '12px 20px', background: '#1A1A1A' }}>
            {['Title', 'Category', 'Status', 'Actions'].map((h) => (
              <span key={h} style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }}>{h}</span>
            ))}
          </div>
          {products.map((p) => (
            <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px 120px', gap: '16px', padding: '16px 20px', background: '#141414', borderBottom: '1px solid rgba(184,150,62,0.06)', alignItems: 'center' }}>
              <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '18px', fontWeight: 400, color: 'var(--offwhite)' }}>{p.title}</p>
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: 'var(--muted)', textTransform: 'capitalize' }}>{p.category}</span>
              <button onClick={() => toggleStatus(p.id, p.status)} style={{ background: 'none', border: `1px solid ${p.status === 'published' ? 'rgba(39,174,96,0.4)' : 'rgba(184,150,62,0.2)'}`, padding: '4px 10px', fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: p.status === 'published' ? '#27ae60' : 'var(--muted)', cursor: 'pointer' }}>
                {p.status}
              </button>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Link href={`/dashboard/products/${p.id}`} style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: 'var(--brass)', textDecoration: 'none', letterSpacing: '0.1em' }}>Edit</Link>
                <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#c0392b', cursor: 'pointer', padding: 0 }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}