'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function DashboardSubmissions() {
  const router = useRouter()
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any>(null)

  useEffect(() => {
    if (sessionStorage.getItem('dashboard_auth') !== 'true') { router.push('/dashboard'); return }
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    const { data } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false })
    setSubmissions(data ?? [])
    setLoading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('contact_submissions').update({ status }).eq('id', id)
    fetchSubmissions()
    if (selected?.id === id) setSelected((p: any) => ({ ...p, status }))
  }

  const statusColor = (s: string) => s === 'new' ? '#B8963E' : s === 'read' ? '#7A7570' : '#27ae60'

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--brass)', marginBottom: '6px' }}>Dashboard</p>
        <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '40px', fontWeight: 300, color: 'var(--offwhite)' }}>Submissions</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '24px' }}>
        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {loading ? (
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: 'var(--muted)' }}>Loading...</p>
          ) : submissions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', border: '1px solid rgba(184,150,62,0.1)' }}>
              <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '24px', color: 'var(--muted)' }}>No submissions yet</p>
            </div>
          ) : submissions.map((s) => (
            <div
              key={s.id}
              onClick={() => { setSelected(s); updateStatus(s.id, s.status === 'new' ? 'read' : s.status) }}
              style={{
                padding: '20px',
                background: selected?.id === s.id ? '#1A1A1A' : '#141414',
                borderLeft: `2px solid ${statusColor(s.status)}`,
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '18px', fontWeight: 400, color: 'var(--offwhite)' }}>{s.name}</p>
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase', color: statusColor(s.status) }}>{s.status}</span>
              </div>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>{s.email}</p>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.message}</p>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: 'rgba(122,117,112,0.5)', marginTop: '8px' }}>
                {new Date(s.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{ background: '#1A1A1A', padding: '32px', border: '1px solid rgba(184,150,62,0.1)', position: 'sticky', top: '40px', alignSelf: 'start' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '28px', fontWeight: 400, color: 'var(--offwhite)', marginBottom: '4px' }}>{selected.name}</h2>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: 'var(--brass)' }}>{selected.email}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '18px' }}>×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {selected.phone && (
                <div>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--brass)', marginBottom: '4px' }}>Phone</p>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: 'var(--offwhite)' }}>{selected.phone}</p>
                </div>
              )}
              {selected.project_type && (
                <div>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--brass)', marginBottom: '4px' }}>Project type</p>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: 'var(--offwhite)', textTransform: 'capitalize' }}>{selected.project_type}</p>
                </div>
              )}
              {selected.budget_range && (
                <div>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--brass)', marginBottom: '4px' }}>Budget</p>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: 'var(--offwhite)' }}>{selected.budget_range}</p>
                </div>
              )}
              <div>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--brass)', marginBottom: '8px' }}>Message</p>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: 'var(--offwhite)', lineHeight: 1.8 }}>{selected.message}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', paddingTop: '20px', borderTop: '1px solid rgba(184,150,62,0.1)' }}>
              <a href={`mailto:${selected.email}`} className="btn-brass-filled" style={{ fontSize: '9px' }}>Reply via Email</a>
              <button
                onClick={() => updateStatus(selected.id, 'replied')}
                className="btn-brass"
                style={{ fontSize: '9px' }}
              >
                Mark Replied
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}