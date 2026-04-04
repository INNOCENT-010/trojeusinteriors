import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Trojeusinteriors — Luxury Interior Design, Lagos',
    template: '%s | Trojeusinteriors',
  },
  description:
    'Trojeusinteriors is a Lagos-based luxury interior design studio crafting bespoke residential and commercial spaces, 3D visualisations, and signature furniture.',
  keywords: ['interior design', 'Lagos', 'Nigeria', 'luxury interiors', '3D renders', 'bespoke furniture'],
  openGraph: {
    title: 'Trojeusinteriors — Luxury Interior Design, Lagos',
    description: 'Bespoke spaces. Enduring design.',
    siteName: 'Trojeusinteriors',
    locale: 'en_NG',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
