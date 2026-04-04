'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Project } from '@/types'

export default function DashboardProjects() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionStorage.getItem('dashboard_auth') !== 'true') {
      router.push('/dashboard')
      return
    }
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    setProjects(data ?? [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return
    await supabase.from('projects').delete().eq('id', id)
    fetchProjects()
  }

  const toggleFeatured = async (id: string, current: boolean) => {
    await supabase.from('projects').update({ featured: !current }).eq('id', id)
    fetchProjects()
  }

  const toggleStatus = async (id: string, current: string) => {
    const next = current === 'published' ? 'draft' : 'published'
    await supabase.from('projects').update({ status: next }).eq('id', id)
    fetchProjects()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--brass)', marginBottom: '6px' }}>
            Dashboard
          </p>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '40px', fontWeight: 300, color: 'var(--offwhite)' }}>
            Projects
          </h1>
        </div>
        <Link href="/dashboard/projects/new" className="btn-brass" style={{ fontSize: '10px' }}>
          + New Project
        </Link>
      </div>

      {loading ? (
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: 'var(--muted)' }}>Loading...</p>
      ) : projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', border: '1px solid rgba(184,150,62,0.1)' }}>
          <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '24px', color: 'var(--muted)' }}>No projects yet</p>
          <Link href="/dashboard/projects/new" style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: 'var(--brass)', textDecoration: 'none', letterSpacing: '0.15em', display: 'block', marginTop: '16px' }}>
            Create your first project →
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px 100px 80px 120px', gap: '16px', padding: '12px 20px', background: '#1A1A1A' }}>
            {['Title', 'Category', 'Status', 'Featured', 'Year', 'Actions'].map((h) => (
              <span key={h} style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }}>{h}</span>
            ))}
          </div>

          {projects.map((project) => (
            <div
              key={project.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 120px 100px 100px 80px 120px',
                gap: '16px',
                padding: '16px 20px',
                background: '#141414',
                borderBottom: '1px solid rgba(184,150,62,0.06)',
                alignItems: 'center',
              }}
            >
              <div>
                <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '18px', fontWeight: 400, color: 'var(--offwhite)' }}>{project.title}</p>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: 'var(--muted)', marginTop: '2px' }}>{project.location}</p>
              </div>

              <span style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: 'var(--muted)', textTransform: 'capitalize' }}>
                {project.category}
              </span>

              <button
                onClick={() => toggleStatus(project.id, project.status)}
                style={{
                  background: 'none',
                  border: `1px solid ${project.status === 'published' ? 'rgba(39,174,96,0.4)' : 'rgba(184,150,62,0.2)'}`,
                  padding: '4px 10px',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '9px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: project.status === 'published' ? '#27ae60' : 'var(--muted)',
                  cursor: 'pointer',
                }}
              >
                {project.status}
              </button>

              <button
                onClick={() => toggleFeatured(project.id, project.featured)}
                style={{
                  background: 'none',
                  border: `1px solid ${project.featured ? 'rgba(184,150,62,0.5)' : 'rgba(184,150,62,0.15)'}`,
                  padding: '4px 10px',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '9px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: project.featured ? 'var(--brass)' : 'var(--muted)',
                  cursor: 'pointer',
                }}
              >
                {project.featured ? 'Yes' : 'No'}
              </button>

              <span style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: 'var(--muted)' }}>
                {project.year}
              </span>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Link
                  href={`/dashboard/projects/${project.id}`}
                  style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: 'var(--brass)', textDecoration: 'none', letterSpacing: '0.1em' }}
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(project.id)}
                  style={{ background: 'none', border: 'none', fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#c0392b', cursor: 'pointer', letterSpacing: '0.1em', padding: 0 }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}