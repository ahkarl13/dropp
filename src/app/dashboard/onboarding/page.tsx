'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function OnboardingPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const clean = username.toLowerCase().replace(/[^a-z0-9_]/g, '')

    const { error } = await supabase.from('profiles').insert({
      id: user.id,
      username: clean,
      display_name: displayName,
      bio,
    })

    if (error) {
      setError(error.message.includes('unique') ? 'That username is taken.' : error.message)
      setLoading(false)
    } else {
      router.push('/dashboard/links')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 400, padding: 32, border: '1px solid #e5e5e5', borderRadius: 12 }}>
        <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 6 }}>Set up your page</h1>
        <p style={{ fontSize: 13, color: '#666', marginBottom: 24 }}>Takes 30 seconds.</p>

        {error && (
          <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8, fontSize: 13, color: '#991b1b', marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>Username</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e5e5', borderRadius: 8, overflow: 'hidden' }}>
              <span style={{ padding: '10px 12px', background: '#f9f9f9', fontSize: 13, color: '#999', borderRight: '1px solid #e5e5e5' }}>dropp.co/</span>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="yourname"
                required
                style={{ flex: 1, padding: '10px 12px', border: 'none', outline: 'none', fontSize: 14 }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>Display name</label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Your Name"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>Bio <span style={{ color: '#bbb' }}>(optional)</span></label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="A short description..."
              rows={3}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !username}
            style={{ padding: '11px 12px', background: '#000', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer', opacity: loading || !username ? 0.5 : 1 }}
          >
            {loading ? 'Creating...' : 'Create my page'}
          </button>
        </form>
      </div>
    </div>
  )
}
