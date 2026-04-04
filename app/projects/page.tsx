import Navbar from '@/components/Navbar'
import { getAllProjects } from '@/lib/queries'
import Image from 'next/image'
import Link from 'next/link'
import type { Project } from '@/types'

export const metadata = { title: 'Projects' }

export default async function ProjectsPage() {
  let projects: Project[] = []
  try { projects = await getAllProjects() } catch {}
  return (
    <main style={{ background: 'var(--charcoal)', minHeight: '100vh', color: 'var(--offwhite)' }}>
      <Navbar />
      <div style={{ paddingTop: '140px', paddingBottom: '120px', maxWidth: '1200px', margin: '0 auto', padding: '140px 40px 120px' }}>
        <p className="overline" style={{ marginBottom: '16px' }}>Portfolio</p>
        <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(48px, 7vw, 96px)', fontWeight: 300, lineHeight: 1, marginBottom: '80px' }}>All Projects</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2px' }}>
          {projects.length > 0 ? projects.map((p: any) => (
            <Link key={p.id} href={`/projects/${p.slug}`} style={{ textDecoration: 'none' }}>
              <div className="project-card" style={{ aspectRatio: '4/3', background: 'var(--charcoal-light)' }}>
                <Image src={p.cover_image} alt={p.title} fill style={{ objectFit: 'cover' }} />
                <div className="project-card-overlay" />
                <div style={{ position: 'absolute', bottom: '24px', left: '24px', zIndex: 2 }}>
                  <p className="overline" style={{ marginBottom: '6px' }}>{p.category} · {p.year}</p>
                  <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '26px', fontWeight: 400 }}>{p.title}</h2>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: 'rgba(244,239,232,0.6)', marginTop: '4px' }}>{p.location}</p>
                </div>
              </div>
            </Link>
          )) : (
            <div style={{ gridColumn: '1/-1', padding: '120px 0', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '24px', color: 'var(--muted)' }}>Projects will appear here once Supabase is connected.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
