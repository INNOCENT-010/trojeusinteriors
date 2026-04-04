'use client'

import { usePathname } from 'next/navigation'
import DashboardNav from '@/components/dashboard/DashboardNav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname === '/dashboard'

  if (isLogin) {
    return <>{children}</>
  }

  return (
    <div style={{ display: 'flex', minHeight: '100svh', background: '#0F0F0F' }}>
      <DashboardNav />
      <main
        style={{
          flex: 1,
          padding: '32px 24px 100px',
          overflowY: 'auto',
        }}
        className="dashboard-main"
      >
        {children}
      </main>
      <style>{`
        @media (min-width: 769px) {
          .dashboard-main {
            margin-left: 240px;
            padding: 40px !important;
            padding-bottom: 40px !important;
          }
        }
      `}</style>
    </div>
  )
}