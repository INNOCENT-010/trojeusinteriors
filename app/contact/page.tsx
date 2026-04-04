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

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return
    setLoading(true)
    const ok = await submitContactForm(form)
    setLoading(false)
    if (ok) router.push('/thank-you')
  }

  return (
    <main style={{ background: 'var(--charcoal)', minHeight: '100vh', color: 'var(--offwhite)' }}>
      <Navbar />

      <div style={{ padding: '120px 24px 80px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Page header */}
        <div style={{ marginBottom: '64px' }}>
          <p className="overline" style={{ marginBottom: '16px' }}>Get in touch</p>
          <h1
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(44px, 8vw, 88px)',
              fontWeight: 300,
              lineHeight: 1.0,
              color: 'var(--offwhite)',
              marginBottom: '20px',
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
              fontSize: '14px',
              fontWeight: 300,
              color: 'var(--muted)',
              lineHeight: 1.9,
              maxWidth: '480px',
            }}
          >
            Every great space begins with a conversation. Tell us about your project
            and we&apos;ll respond within 48 hours.
          </p>
        </div>

        {/* Two column on desktop, stacked on mobile */}
        <div className="contact-grid">

          {/* Left — contact info */}
          <div className="contact-info">
            {[
              { label: 'Studio', value: 'Lagos, Nigeria' },
              { label: 'Email', value: 'trojeus@gmail.com' },
              { label: 'Instagram', value: 'trojeusinteriors' },
              { label: 'Phone', value: '+234 903 007 9319' },
              { label: 'Whatsapp', value: '+234 810 494 5035' },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  paddingBottom: '24px',
                  marginBottom: '24px',
                  borderBottom: '1px solid rgba(184,150,62,0.12)',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '9px',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'var(--brass)',
                    marginBottom: '8px',
                  }}
                >
                  {item.label}
                </p>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', color: 'var(--offwhite)', fontWeight: 300 }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Right — form */}
          <div>
            {/* Name + Email */}
            <div className="form-row" style={{ marginBottom: '32px' }}>
              <div className="form-field">
                <label className="field-label">Full name *</label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="field-input"
                />
              </div>
              <div className="form-field">
                <label className="field-label">Email *</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="field-input"
                />
              </div>
            </div>

            {/* Phone + Project type */}
            <div className="form-row" style={{ marginBottom: '32px' }}>
              <div className="form-field">
                <label className="field-label">Phone</label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+234 —"
                  className="field-input"
                />
              </div>
              <div className="form-field">
                <label className="field-label">Project type</label>
                <select name="project_type" value={form.project_type} onChange={handleChange} className="field-input">
                  <option value="">Select type</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="hospitality">Hospitality</option>
                  <option value="3d-renders">3D Renders only</option>
                  <option value="product-design">Product Design</option>
                </select>
              </div>
            </div>

            {/* Budget */}
            <div style={{ marginBottom: '32px' }}>
              <label className="field-label">Budget range</label>
              <select name="budget_range" value={form.budget_range} onChange={handleChange} className="field-input" style={{ width: '100%' }}>
                <option value="">Prefer not to say</option>
                <option value="below-5m">Below ₦5 million</option>
                <option value="5m-15m">₦5M – ₦15M</option>
                <option value="15m-50m">₦15M – ₦50M</option>
                <option value="above-50m">Above ₦50M</option>
              </select>
            </div>

            {/* Message */}
            <div style={{ marginBottom: '40px' }}>
              <label className="field-label">Your message *</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={6}
                placeholder="Tell us about your space, your vision, and your timeline..."
                className="field-input"
                style={{ width: '100%', resize: 'none', lineHeight: 1.8 }}
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

      <style>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 80px;
          align-items: start;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .form-field {
          display: flex;
          flex-direction: column;
        }
        .field-label {
          font-family: var(--font-inter);
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--brass);
          display: block;
          margin-bottom: 8px;
        }
        .field-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(184,150,62,0.25);
          padding: 14px 0;
          font-family: var(--font-inter);
          font-size: 14px;
          font-weight: 300;
          color: var(--offwhite);
          outline: none;
          letter-spacing: 0.02em;
          transition: border-color 0.3s ease;
        }
        .field-input::placeholder {
          color: var(--muted);
        }
        .field-input:focus {
          border-bottom-color: rgba(184,150,62,0.6);
        }
        select.field-input option {
          background: #1A1A1A;
          color: var(--offwhite);
        }

        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          .contact-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0 24px;
          }
          .form-row {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
        }

        @media (max-width: 480px) {
          .contact-info {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  )
}