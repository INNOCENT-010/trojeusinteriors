import Navbar from '@/components/Navbar'
import { get3DRenders } from '@/lib/queries'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = { title: '3D Renders' }

export default async function RendersPage() {
  let renders: any[] = []
  try { renders = await get3DRenders() } catch {}
  return (
    <main style={{ background: 'var(--charcoal)', minHeight: '100vh', color: 'var(--offwhite)' }}>
      <Navbar />
      <div style={{ padding: '140px 40px 120px', maxWidth: '1200px', margin: '0 auto' }}>
        <p className="overline" style={{ marginBottom: '16px' }}>Visualisation</p>
        <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(48px, 7vw, 96px)', fontWeight: 300, lineHeight: 1, marginBottom: '24px' }}>3D Renders</h1>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', fontWeight: 300, color: 'var(--muted)', maxWidth: '560px', lineHeight: 1.9, marginBottom: '80px' }}>
          Photorealistic visualisations that let you experience a space before construction begins. Every render is crafted with precision lighting, material accuracy, and spatial integrity.
        </p>
        <div style={{ columns: '2', gap: '2px' }}>
          {renders.length > 0 ? renders.map((r: any) => (
            <Link key={r.id} href={`/projects/${r.slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: '2px', breakInside: 'avoid' }}>
              <div className="project-card" style={{ aspectRatio: '4/3', background: 'var(--charcoal-light)' }}>
                <Image src={r.cover_image} alt={r.title} fill style={{ objectFit: 'cover' }} />
                <div className="project-card-overlay" />
                <div style={{ position: 'absolute', bottom: '20px', left: '20px', zIndex: 2 }}>
                  <p className="overline" style={{ marginBottom: '4px' }}>{r.category}</p>
                  <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '22px', fontWeight: 400 }}>{r.title}</h2>
                </div>
              </div>
            </Link>
          )) : (
            <div style={{ padding: '120px 0', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '24px', color: 'var(--muted)' }}>3D renders will appear here once Supabase is connected.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
