import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import LinkButton from '@/components/LinkButton'

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (!profile) notFound()

  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('profile_id', profile.id)
    .eq('enabled', true)
    .order('position')

  supabase.from('page_views').insert({ profile_id: profile.id })

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', justifyContent: 'center', paddingTop: 60, paddingBottom: 60 }}>
      <div style={{ width: '100%', maxWidth: 480, padding: '0 20px' }}>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: '#000', color: '#fff',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 500, marginBottom: 14
          }}>
            {(profile.display_name || profile.username)[0].toUpperCase()}
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 6 }}>
            {profile.display_name || profile.username}
          </h1>
          {profile.bio && (
            <p style={{ fontSize: 14, color: '#666', maxWidth: 320, margin: '0 auto', lineHeight: 1.6 }}>
              {profile.bio}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(links || []).map(link => (
            <LinkButton key={link.id} href={link.url} title={link.title} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <a href="/" style={{ fontSize: 12, color: '#bbb', textDecoration: 'none' }}>made with dropp</a>
        </div>
      </div>
    </div>
  )
}
