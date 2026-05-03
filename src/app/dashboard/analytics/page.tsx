import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/dashboard/onboarding')

  // last 30 days
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [{ count: totalViews }, { count: totalClicks }, { data: links }] = await Promise.all([
    supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profile.id)
      .gte('created_at', since),
    supabase
      .from('link_clicks')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', since),
    supabase
      .from('links')
      .select('id, title, type')
      .eq('profile_id', profile.id),
  ])

  // click counts per link
  const clicksPerLink: Record<string, number> = {}
  if (links) {
    await Promise.all(
      links.map(async (link) => {
        const { count } = await supabase
          .from('link_clicks')
          .select('*', { count: 'exact', head: true })
          .eq('link_id', link.id)
          .gte('created_at', since)
        clicksPerLink[link.id] = count || 0
      })
    )
  }

  const ctr = totalViews && totalClicks
    ? Math.round((totalClicks / totalViews) * 100)
    : 0

  const sortedLinks = (links || [])
    .map(l => ({ ...l, clicks: clicksPerLink[l.id] || 0 }))
    .sort((a, b) => b.clicks - a.clicks)

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 24px' }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 4 }}>Analytics</h1>
      <p style={{ fontSize: 12, color: '#999', marginBottom: 28 }}>Last 30 days</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
        {[
          { label: 'Page views', value: totalViews ?? 0 },
          { label: 'Link clicks', value: totalClicks ?? 0 },
          { label: 'Click rate', value: `${ctr}%` },
        ].map(s => (
          <div key={s.label} style={{ padding: '16px 18px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: 10 }}>
            <div style={{ fontSize: 11, color: '#999', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 600 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Link breakdown */}
      <div>
        <div style={{ fontSize: 12, color: '#999', marginBottom: 12, fontWeight: 500 }}>Clicks per link</div>
        {sortedLinks.length === 0 && (
          <div style={{ textAlign: 'center', padding: 32, border: '1px dashed #e5e5e5', borderRadius: 10, color: '#999', fontSize: 13 }}>
            No links yet
          </div>
        )}
        {sortedLinks.map((link, i) => {
          const max = sortedLinks[0]?.clicks || 1
          const pct = Math.round((link.clicks / max) * 100)
          return (
            <div key={link.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <div style={{ width: 20, fontSize: 11, color: '#ccc', textAlign: 'right' }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13 }}>{link.title}</span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{link.clicks}</span>
                </div>
                <div style={{ height: 4, background: '#f0f0f0', borderRadius: 2 }}>
                  <div style={{ height: 4, width: `${pct}%`, background: '#000', borderRadius: 2 }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
