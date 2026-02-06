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
    const response = await fetch(`${baseURL}/api/glix/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resumeText: testResume,
        streamType: 'pcm'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    if (!text) {
      throw new Error('Empty response from server');
    }

    const result = JSON.parse(text);
    
    console.log('✅ SUCCESS! Unified API Response:');
    console.log(`📊 Status: ${result.success ? 'Success' : 'Failed'}`);
    console.log(`📝 Message: ${result.message || 'No message'}`);
    
    if (result.success) {
      console.log(`📈 Match Score: ${result.data.score}%`);
      console.log(`🎯 Stream: ${result.data.stream?.title || 'N/A'}`);
      console.log(`⚠️  Gaps: ${result.data.gaps?.length || 0} identified`);
      if (result.data.glixAI_insights) {
        console.log(`🤖 Automation Risk: ${result.data.glixAI_insights.automation_risk?.level || 'N/A'}`);
        console.log(`💰 Salary Potential: $${result.data.glixAI_insights.shadow_salary?.potential?.toLocaleString() || 'N/A'}`);
      }
    } else {
      console.log(`❌ API Error: ${result.error}`);
    }

  } catch (error) {
    console.error(`❌ FAILED! Unified API:`, error.message);
  }
};

// Run the test
testUnifiedAPI().catch(console.error);
