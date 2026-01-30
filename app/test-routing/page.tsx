export default function TestPage() {
  return (
    <div style={{ padding: '20px', textAlign: 'center', minHeight: '100vh' }}>
      <h1>Test Page - Routing Works!</h1>
      <p>If you can see this, routing is working correctly.</p>
      <p>Timestamp: {new Date().toISOString()}</p>
    </div>
  )
}
