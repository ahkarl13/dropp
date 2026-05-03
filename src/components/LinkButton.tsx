'use client'

type Props = {
  href: string
  title: string
}

export default function LinkButton({ href, title }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block',
        padding: '14px 20px',
        background: '#fff',
        border: '1px solid #e5e5e5',
        borderRadius: 12,
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 500,
        color: '#000',
        textDecoration: 'none',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f5')}
      onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
    >
      {title}
    </a>
  )
}
