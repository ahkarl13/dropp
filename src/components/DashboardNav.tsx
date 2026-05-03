'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const links = [
  { href: '/dashboard/links', label: 'Links' },
  { href: '/dashboard/products', label: 'Products' },
  { href: '/dashboard/analytics', label: 'Analytics' },
]

export default function DashboardNav({ username }: { username: string }) {
  const pathname = usePathname()

  return (
    <nav style={{
      borderBottom: '1px solid #e5e5e5',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 52,
      background: '#fff',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em' }}>dropp</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontSize: 13,
                padding: '5px 10px',
                borderRadius: 6,
                textDecoration: 'none',
                background: pathname === l.href ? '#f0f0f0' : 'transparent',
                color: pathname === l.href ? '#000' : '#666',
                fontWeight: pathname === l.href ? 500 : 400,
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
      <a
        href={`/${username}`}
        target="_blank"
        style={{ fontSize: 12, color: '#999', textDecoration: 'none' }}
      >
        dropp.co/{username} ↗
      </a>
    </nav>
  )
}
