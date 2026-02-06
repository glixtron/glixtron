const testSimpleAPI = async () => {
  console.log('🔬 Testing Simple API...\n');

  try {
    const response = await fetch('http://localhost:3000/api/glix/analyze', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    const text = await response.text();
    console.log('Response text:', text);

  } catch (error) {
    console.error('❌ FAILED! Simple API:', error.message);
  }
};

testSimpleAPI().catch(console.error);
