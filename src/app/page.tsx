import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', height: 56, borderBottom: '1px solid #f0f0f0' }}>
        <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.03em' }}>dropp</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/login" style={{ fontSize: 13, color: '#666', textDecoration: 'none' }}>Log in</Link>
          <Link href="/login" style={{ fontSize: 13, color: '#fff', background: '#000', padding: '7px 16px', borderRadius: 8, textDecoration: 'none', fontWeight: 500 }}>
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '100px 24px 80px' }}>
        <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: '#666', background: '#f5f5f5', padding: '4px 12px', borderRadius: 20, marginBottom: 24 }}>
          FREE TO START · NO CREDIT CARD
        </div>
        <h1 style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.03em', maxWidth: 600, margin: '0 auto 20px', color: '#000' }}>
          One link.<br />Everything you sell.
        </h1>
        <p style={{ fontSize: 18, color: '#666', maxWidth: 440, margin: '0 auto 40px', lineHeight: 1.6 }}>
          dropp gives creators a beautiful link-in-bio page with built-in digital product sales. No extra tools needed.
        </p>
        <Link href="/login" style={{ display: 'inline-block', fontSize: 15, fontWeight: 600, color: '#fff', background: '#000', padding: '14px 32px', borderRadius: 10, textDecoration: 'none' }}>
          Create your page — it's free
        </Link>
        <p style={{ fontSize: 12, color: '#bbb', marginTop: 14 }}>Takes 2 minutes to set up</p>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 100px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
        {[
          { icon: '⚡', title: 'Instant setup', desc: 'Pick a username, add your links, share your page. Live in under 2 minutes.' },
          { icon: '💳', title: 'Sell digital products', desc: 'Add any digital product — presets, templates, ebooks — and get paid directly via Stripe.' },
          { icon: '📊', title: 'See what works', desc: 'Track page views and link clicks. Know exactly what your audience is clicking.' },
          { icon: '🎨', title: 'Clean by default', desc: 'No clutter, no ads, no noise. Just your links and your brand.' },
        ].map(f => (
          <div key={f.title} style={{ padding: '28px 24px', border: '1px solid #f0f0f0', borderRadius: 14, background: '#fff' }}>
            <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{f.title}</div>
            <div style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>{f.desc}</div>
          </div>
        ))}
      </section>

      {/* Pricing */}
      <section style={{ background: '#fafafa', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 }}>Simple pricing</h2>
          <p style={{ fontSize: 16, color: '#666' }}>Start free. Upgrade when you're ready.</p>
        </div>
        <div style={{ maxWidth: 680, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {[
            {
              name: 'Free',
              price: '$0',
              period: 'forever',
              features: ['Unlimited links', 'Public profile page', 'Basic analytics', '5% transaction fee on products'],
              cta: 'Get started',
              highlight: false,
            },
            {
              name: 'Pro',
              price: '$19',
              period: 'per month',
              features: ['Everything in Free', '0% transaction fees', 'Priority support', 'Custom domain (coming soon)'],
              cta: 'Start Pro free',
              highlight: true,
            },
          ].map(plan => (
            <div key={plan.name} style={{
              padding: '32px 28px',
              border: plan.highlight ? '2px solid #000' : '1px solid #e5e5e5',
              borderRadius: 14,
              background: '#fff',
            }}>
              {plan.highlight && (
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#fff', background: '#000', display: 'inline-block', padding: '3px 10px', borderRadius: 20, marginBottom: 16 }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{plan.name}</div>
              <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>{plan.price}</div>
              <div style={{ fontSize: 13, color: '#999', marginBottom: 24 }}>{plan.period}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ fontSize: 13, color: '#555', display: 'flex', gap: 8 }}>
                    <span style={{ color: '#000', fontWeight: 600 }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <Link href="/login" style={{
                display: 'block',
                textAlign: 'center',
                padding: '11px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                textDecoration: 'none',
                background: plan.highlight ? '#000' : '#fff',
                color: plan.highlight ? '#fff' : '#000',
                border: plan.highlight ? 'none' : '1px solid #e5e5e5',
              }}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '32px 24px', borderTop: '1px solid #f0f0f0' }}>
        <span style={{ fontSize: 13, color: '#bbb' }}>© 2025 dropp · built with Next.js & Supabase</span>
      </footer>
    </div>
  )
}
