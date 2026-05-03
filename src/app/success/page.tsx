export default function SuccessPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
        <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 8 }}>Payment successful</h1>
        <p style={{ fontSize: 14, color: '#666', marginBottom: 24 }}>
          Check your email for your download link.
        </p>
        <a href="/" style={{ fontSize: 14, color: '#000', fontWeight: 500 }}>
          Back to dropp
        </a>
      </div>
    </div>
  )
}
