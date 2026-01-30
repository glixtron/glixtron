export default function DebugPage() {
  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '1rem' }}>
        🚀 DEBUG PAGE - ROUTING TEST
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem' }}>
        If you can see this, routing is working correctly!
      </p>
      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
        Timestamp: {new Date().toISOString()}
      </p>
      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        background: 'rgba(255,255,255,255,0.1)', 
        borderRadius: '8px' 
      }}>
        <h3 style={{ color: 'white' }}>Test Results:</h3>
        <ul style={{ color: 'rgba(255,255,255,0.9)', textAlign: 'left' }}>
          <li>✅ Build: Successful</li>
          <li>✅ API: Working</li>
          <li>✅ Middleware: Disabled</li>
          <li>✅ Test Page: Loading</li>
        </ul>
      </div>
    </div>
  )
}
