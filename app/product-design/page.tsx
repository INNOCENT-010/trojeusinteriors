'use client'

import Navbar from '@/components/Navbar'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ProductDesignPage() {
  const [products, setProducts] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [active, setActive] = useState('All')
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>(['All'])

  useEffect(() => {
    // Fetch categories from Supabase
    supabase
      .from('categories')
      .select('name')
      .eq('type', 'product')
      .order('name')
      .then(({ data }) => {
        if (data) setCategories(['All', ...data.map((c) => c.name)])
      })

    // Fetch products
    supabase
      .from('product_designs')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setProducts(data ?? [])
        setFiltered(data ?? [])
        setLoading(false)
      })
  }, [])

  const handleFilter = (cat: string) => {
    setActive(cat)
    if (cat === 'All') {
      setFiltered(products)
    } else {
      setFiltered(products.filter((p) => p.category.toLowerCase() === cat.toLowerCase()))
    }
  }

  return (
    <main style={{ background: 'var(--charcoal)', minHeight: '100vh', color: 'var(--offwhite)' }}>
      <Navbar />
      <div style={{ padding: '140px 40px 120px', maxWidth: '1200px', margin: '0 auto' }}>
        <p className="overline" style={{ marginBottom: '16px' }}>Objects & furniture</p>
        <h1
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(48px, 7vw, 96px)',
            fontWeight: 300,
            lineHeight: 1,
            marginBottom: '24px',
          }}
        >
          Product Design
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '14px',
            fontWeight: 300,
            color: 'var(--muted)',
            maxWidth: '560px',
            lineHeight: 1.9,
            marginBottom: '64px',
          }}
        >
          Furniture as a form of fine art. Each piece is conceived as an object in its own
          right — crafted with precision materials and enduring proportions.
        </p>

        {/* Category filter */}
        <div
          style={{
            display: 'flex',
            gap: '0',
            marginBottom: '64px',
            borderBottom: '1px solid rgba(184,150,62,0.15)',
            flexWrap: 'wrap',
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilter(cat)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: active === cat ? '1px solid var(--brass)' : '1px solid transparent',
                padding: '12px 24px 12px 0',
                fontFamily: 'var(--font-inter)',
                fontSize: '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: active === cat ? 'var(--brass)' : 'var(--muted)',
                cursor: 'pointer',
                marginBottom: '-1px',
                transition: 'color 0.3s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: '80px 0', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '24px', color: 'var(--muted)' }}>
              Loading...
            </p>
          </div>
        ) : filtered.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            {filtered.map((p) => (
              <Link
                key={p.id}
                href={`/product-design/${p.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="project-card"
                  style={{
                    aspectRatio: '3/4',
                    background: 'var(--charcoal-light)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {p.images?.[0] && (
                    <Image
                      src={p.images[0]}
                      alt={p.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                  <div className="project-card-overlay" />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '24px',
                      left: '24px',
                      zIndex: 2,
                    }}
                  >
                    <p className="overline" style={{ marginBottom: '6px', textTransform: 'capitalize' }}>
                      {p.category}
                    </p>
                    <h2
                      style={{
                        fontFamily: 'var(--font-cormorant)',
                        fontSize: '24px',
                        fontWeight: 400,
                        color: 'var(--offwhite)',
                        lineHeight: 1.1,
                      }}
                    >
                      {p.title}
                    </h2>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ padding: '100px 0', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '24px', color: 'var(--muted)' }}>
              No {active.toLowerCase()} pieces yet.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}