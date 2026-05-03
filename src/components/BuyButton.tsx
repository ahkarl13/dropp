'use client'
import { useState } from 'react'

type Props = {
  linkId: string
  title: string
  priceCents: number
  sellerUsername: string
}

export default function BuyButton({ linkId, title, priceCents, sellerUsername }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleBuy() {
    setLoading(true)
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ linkId, title, priceCents, sellerUsername }),
    })
    const { url } = await res.json()
    window.location.href = url
  }

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      style={{
        display: 'block',
        width: '100%',
        padding: '14px 20px',
        background: '#000',
        border: 'none',
        borderRadius: 12,
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 500,
        color: '#fff',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? 'Redirecting...' : `Buy — $${(priceCents / 100).toFixed(2)}`}
    </button>
  )
}
