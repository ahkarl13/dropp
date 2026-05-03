import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div style={{ maxWidth: 640, margin: '60px auto', padding: '0 24px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 8 }}>Dashboard</h1>
      <p style={{ fontSize: 14, color: '#666', marginBottom: 32 }}>
        Logged in as {user.email}
      </p>
      {!profile ? (
        <div style={{ padding: 24, border: '1px dashed #e5e5e5', borderRadius: 12, textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>
            You don't have a profile yet.
          </p>
          <a href="/dashboard/onboarding" style={{ fontSize: 14, color: '#000', fontWeight: 500 }}>
            Set up your page →
          </a>
        </div>
      ) : (
        <p style={{ fontSize: 14 }}>
          Your page: <a href={`/${profile.username}`} style={{ color: '#000', fontWeight: 500 }}>
            dropp.co/{profile.username}
          </a>
        </p>
      )}
    </div>
  )
}