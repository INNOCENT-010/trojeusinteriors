import DashboardNav from '@/components/dashboard/DashboardNav'

export const metadata = { title: 'Dashboard — Trojeusinteriors' }

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0F0F0F' }}>
      <DashboardNav />
      <main style={{ flex: 1, marginLeft: '240px', padding: '40px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}