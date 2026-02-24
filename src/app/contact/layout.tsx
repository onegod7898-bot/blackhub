import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with BlackHub for support, legal inquiries, or feedback.',
  robots: { index: true, follow: true },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
