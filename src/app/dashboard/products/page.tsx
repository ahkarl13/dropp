'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type Product = {
  id: string
  title: string
  url: string
  price_cents: number
  enabled: boolean
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [url, setUrl] = useState('')
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('links')
        .select('*')
        .eq('profile_id', user.id)
        .eq('type', 'product')
        .order('position')
      setProducts(data || [])
    }
    load()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const priceCents = Math.round(parseFloat(price) * 100)

    const { data } = await supabase.from('links').insert({
      profile_id: user.id,
      title,
      url,
      type: 'product',
      price_cents: priceCents,
      position: products.length,
    }).select().single()

    if (data) setProducts([...products, data])
    setTitle('')
    setPrice('')
    setUrl('')
    setShowForm(false)
    setSaving(false)
  }

  async function handleDelete(id: string) {
    await supabase.from('links').delete().eq('id', id)
    setProducts(products.filter(p => p.id !== id))
  }

  return (
    <div style={{ maxWidth: 560, margin: '40px auto', padding: '0 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 2 }}>Products</h1>
          <p style={{ fontSize: 12, color: '#999' }}>Digital products shown on your public page</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          style={{ padding: '9px 16px', background: '#000', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}
        >
          + Add product
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} style={{ padding: 16, border: '1px solid #e5e5e5', borderRadius: 10, marginBottom: 20, background: '#fafafa' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              type="text"
              placeholder="Product name (e.g. Lightroom Presets)"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              style={{ padding: '9px 12px', border: '1px solid #e5e5e5', borderRadius: 7, fontSize: 13 }}
            />
            <input
              type="number"
              placeholder="Price in USD (e.g. 19)"
              value={price}
              onChange={e => setPrice(e.target.value)}
              min="1"
              step="0.01"
              required
              style={{ padding: '9px 12px', border: '1px solid #e5e5e5', borderRadius: 7, fontSize: 13 }}
            />
            <input
              type="text"
              placeholder="Download URL (Google Drive, Dropbox, etc.)"
              value={url}
              onChange={e => setUrl(e.target.value)}
              required
              style={{ padding: '9px 12px', border: '1px solid #e5e5e5', borderRadius: 7, fontSize: 13 }}
            />
            <p style={{ fontSize: 11, color: '#999', margin: 0 }}>
              The download URL is sent to the buyer after payment. Use a shared Google Drive or Dropbox link.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" disabled={saving} style={{ flex: 1, padding: '9px', background: '#000', color: '#fff', border: 'none', borderRadius: 7, fontSize: 13, cursor: 'pointer' }}>
                {saving ? 'Saving...' : 'Add product'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '9px 16px', border: '1px solid #e5e5e5', borderRadius: 7, fontSize: 13, cursor: 'pointer', background: '#fff' }}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {products.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', padding: 40, border: '1px dashed #e5e5e5', borderRadius: 10, color: '#999', fontSize: 14 }}>
          No products yet — add something to sell
        </div>
      )}

      {products.map(p => (
        <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', border: '1px solid #e5e5e5', borderRadius: 10, background: '#fff', marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{p.title}</div>
            <div style={{ fontSize: 12, color: '#999' }}>${(p.price_cents / 100).toFixed(2)}</div>
          </div>
          <button onClick={() => handleDelete(p.id)} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '1px solid #fecaca', background: '#fef2f2', color: '#991b1b', cursor: 'pointer' }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}
