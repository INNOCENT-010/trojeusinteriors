'use client'

import Navbar from '@/components/Navbar'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitContactForm } from '@/lib/queries'

export default function ContactPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', message: '', project_type: '', budget_range: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setLoading(true)
    const ok = await submitContactForm(form)
    setLoading(false)
    if (ok) router.push('/thank-you')
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(184,150,62,0.25)',
    padding: '14px 0',
    fontFamily: 'var(--font-inter)',
    fontSize: '14px',
    fontWeight: 300,
    color: 'var(--offwhite)',
    outline: 'none',
    letterSpacing: '0.02em',
    transition: 'border-color 0.3s ease',
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-inter)',
    fontSize: '9px',
    fontWeight: 400,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'var(--brass)',
    display: 'block',
    marginBottom: '4px',
  }

  return (
    <main style={{ background: 'var(--charcoal)', minHeight: '100vh', color: 'var(--offwhite)' }}>
      <Navbar />
      <div style={{ padding: '140px 40px 120px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '120px', alignItems: 'start' }}>

          {/* Left — text */}
          <div>
            <p className="overline" style={{ marginBottom: '16px' }}>Get in touch</p>
            <h1
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: 'clamp(44px, 5.5vw, 72px)',
                fontWeight: 300,
                lineHeight: 1.05,
                color: 'var(--offwhite)',
                marginBottom: '32px',
              }}
            >
              Let&apos;s start
              <br />
              <em style={{ fontStyle: 'italic', color: 'var(--brass-light)' }}>something</em>
              <br />
              remarkable.
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '13px',
                fontWeight: 300,
                color: 'var(--muted)',
                lineHeight: 1.9,
                maxWidth: '380px',
                marginBottom: '60px',
              }}
            >
              Every great space begins with a conversation. Tell us about your project and we&apos;ll
              respond within 48 hours with initial thoughts and next steps.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {[
                { label: 'Studio', value: 'Lagos, Nigeria' },
                { label: 'Email', value: 'hello@trojeusinteriors.com' },
                { label: 'Instagram', value: '@trojeusinteriors' },
              ].map((item) => (
                <div key={item.label}>
                  <p style={{ ...labelStyle, marginBottom: '4px' }}>{item.label}</p>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: 'var(--offwhite)', fontWeight: 300 }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
              <div>
                <label style={labelStyle} htmlFor="name">Full name *</label>
                <input id="name" name="name" type="text" value={form.name} onChange={handleChange} style={inputStyle} placeholder="Your name" />
              </div>
              <div>
                <label style={labelStyle} htmlFor="email">Email *</label>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange} style={inputStyle} placeholder="your@email.com" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
              <div>
                <label style={labelStyle} htmlFor="phone">Phone</label>
                <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} style={inputStyle} placeholder="+234 —" />
              </div>
              <div>
                <label style={labelStyle} htmlFor="project_type">Project type</label>
                <select
                  id="project_type"
                  name="project_type"
                  value={form.project_type}
                  onChange={handleChange}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="" style={{ background: '#1A1A1A' }}>Select type</option>
                  <option value="residential" style={{ background: '#1A1A1A' }}>Residential</option>
                  <option value="commercial" style={{ background: '#1A1A1A' }}>Commercial</option>
                  <option value="hospitality" style={{ background: '#1A1A1A' }}>Hospitality</option>
                  <option value="3d-renders" style={{ background: '#1A1A1A' }}>3D Renders only</option>
                  <option value="product-design" style={{ background: '#1A1A1A' }}>Product Design</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={labelStyle} htmlFor="budget_range">Budget range</label>
              <select
                id="budget_range"
                name="budget_range"
                value={form.budget_range}
                onChange={handleChange}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="" style={{ background: '#1A1A1A' }}>Prefer not to say</option>
                <option value="below-5m" style={{ background: '#1A1A1A' }}>Below ₦5 million</option>
                <option value="5m-15m" style={{ background: '#1A1A1A' }}>₦5M – ₦15M</option>
                <option value="15m-50m" style={{ background: '#1A1A1A' }}>₦15M – ₦50M</option>
                <option value="above-50m" style={{ background: '#1A1A1A' }}>Above ₦50M</option>
              </select>
            </div>

            <div style={{ marginBottom: '48px' }}>
              <label style={labelStyle} htmlFor="message">Your message *</label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                style={{ ...inputStyle, resize: 'none', lineHeight: 1.8 }}
                placeholder="Tell us about your space, your vision, and your timeline..."
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-brass"
              style={{ width: '100%', fontSize: '10px', opacity: loading ? 0.6 : 1 }}
            >
              {loading ? 'Sending...' : 'Send message'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
