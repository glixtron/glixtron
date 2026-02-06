const testUnifiedAPI = async () => {
  console.log('🔬 Testing Unified GlixAI API...\n');

  const baseURL = 'http://localhost:3000';
  
  const testResume = `John Davidson
Physics Graduate Student
Skills: Quantum Mechanics, MATLAB, Python, Calculus, Thermodynamics, Statistical Analysis
Experience: Quantum computing research, computational physics, mathematical modeling
Education: PhD Physics, MIT
Research: Published 5 papers on quantum systems and theoretical physics`;

  try {
    // Test both GET and POST methods
    console.log('📡 Testing GlixAI API GET (Health Check)...');
    const getResponse = await fetch(`${baseURL}/api/glix/analyze`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!getResponse.ok) {
      console.error('❌ GET Health Check Failed:', getResponse.status);
    } else {
      const healthData = await getResponse.json();
      console.log('✅ GET Health Status:', healthData.success);
      console.log('📊 Features:', healthData.data?.features?.join(', ') || 'No features listed');
    }

    console.log('📡 Testing GlixAI API POST (Analysis)...');
    const postResponse = await fetch(`${baseURL}/api/glix/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resumeText: testResume,
        streamType: 'pcm'
      })
    });

    if (!postResponse.ok) {
      console.error('❌ POST Analysis Failed:', postResponse.status);
    } else {
      const text = await postResponse.text();
      if (!text) {
        throw new Error('Empty response from server');
      }

      const result = JSON.parse(text);
      
      if (result.success) {
        console.log('✅ SUCCESS! Unified API Response:');
        console.log(`📊 Status: ${result.success ? 'Success' : 'Failed'}`);
        console.log(`📝 Message: ${result.message || 'No message'}`);
        
        if (result.data) {
          console.log(`📈 Match Score: ${result.data.score}%`);
          console.log(`🎯 Stream: ${result.data.stream?.title || 'N/A'}`);
          console.log(`⚠️  Gaps: ${result.data.gaps?.length || 0} identified`);
          
          if (result.data.glixAI_insights) {
            console.log(`🤖 Automation Risk: ${result.data.glixAI_insights?.automation_risk?.level || 'Unknown'}`);
            console.log(`💰 Salary Potential: $${result.data.glixAI_insights?.shadow_salary?.potential?.toLocaleString() || 'N/A'}`);
            console.log(`📈 Future-Proof Score: ${result.data.glixAI_insights?.future_proofing?.score || 0}%`);
          }
        }
      } else {
        console.log(`❌ API Error: ${result.error || 'Analysis failed'}`);
      }
    }

  } catch (error) {
    console.error('❌ API Test Error:', error.message);
  }
};

// Run the test
testUnifiedAPI().catch(console.error);
