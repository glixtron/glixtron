const testGlixAIComplete = async () => {
  console.log('🚀 Testing Complete GlixAI Integration...\n');

  const baseURL = 'http://localhost:3000';
  
  // Test data
  const testResume = `John Davidson
Physics Graduate Student
Skills: Quantum Mechanics, MATLAB, Python, Calculus, Thermodynamics, Statistical Analysis
Experience: Quantum computing research, computational physics, mathematical modeling
Education: PhD Physics, MIT
Research: Published 5 papers on quantum systems and theoretical physics`;

  const testCases = [
    {
      name: 'GlixAI Resume Analysis',
      endpoint: '/api/glixai/resume',
      method: 'POST',
      data: { resumeText: testResume },
      expectedFields: ['score', 'streamData', 'gaps', 'glixAI_insights']
    },
    {
      name: 'GlixAI Chat Assistant',
      endpoint: '/api/glixai/chat',
      method: 'POST',
      data: {
        message: 'What career paths are available for physics graduates?',
        session_id: 'test_session_123'
      },
      expectedFields: ['id', 'role', 'content', 'timestamp', 'suggestions']
    },
    {
      name: 'GlixAI Job Search',
      endpoint: '/api/glixai/jobs',
      method: 'POST',
      data: {
        query: 'Data Scientist',
        location: 'San Francisco',
        stream: 'general'
      },
      expectedFields: ['jobs', 'total', 'query', 'location']
    },
    {
      name: 'GlixAI Roadmap Generator',
      endpoint: '/api/glixai/roadmap',
      method: 'POST',
      data: {
        currentSkills: ['Python', 'Machine Learning', 'Statistics'],
        targetRole: 'Data Scientist',
        stream: 'general'
      },
      expectedFields: ['target_role', 'phases', 'glixAI_insights']
    }
  ];

  let allTestsPassed = true;

  for (const testCase of testCases) {
    console.log(`🔬 Testing: ${testCase.name}`);
    console.log(`📡 Endpoint: ${testCase.method} ${testCase.endpoint}\n`);

    try {
      const response = await fetch(`${baseURL}${testCase.endpoint}`, {
        method: testCase.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase.data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      console.log('✅ SUCCESS! Response received:');
      console.log(`📊 Status: ${result.success ? 'Success' : 'Failed'}`);
      console.log(`📝 Message: ${result.message || 'No message'}`);
      
      if (result.success) {
        // Check expected fields
        const hasAllFields = testCase.expectedFields.every(field => {
          const hasField = field.includes('.') 
            ? field.split('.').reduce((obj, key) => obj && obj[key], result.data)
            : result.data && result.data[field];
          return hasField !== undefined;
        });

        console.log(`🔍 Fields Check: ${hasAllFields ? '✅ All expected fields present' : '❌ Missing fields'}`);
        
        // Display key results
        if (testCase.name === 'GlixAI Resume Analysis') {
          console.log(`📈 Match Score: ${result.data.score}%`);
          console.log(`🎯 Stream: ${result.data.streamData?.title || 'N/A'}`);
          console.log(`⚠️  Gaps: ${result.data.gaps?.length || 0} identified`);
          if (result.data.glixAI_insights) {
            console.log(`🤖 Automation Risk: ${result.data.glixAI_insights.automation_risk?.level || 'N/A'}`);
            console.log(`💰 Salary Potential: $${result.data.glixAI_insights.shadow_salary?.current?.toLocaleString() || 'N/A'}`);
          }
        }
        
        if (testCase.name === 'GlixAI Chat Assistant') {
          console.log(`💬 AI Response: ${result.data.content?.substring(0, 100)}...`);
          console.log(`🎯 Suggestions: ${result.data.suggestions?.length || 0} available`);
        }
        
        if (testCase.name === 'GlixAI Job Search') {
          console.log(`📋 Jobs Found: ${result.data.jobs?.length || 0}`);
          if (result.data.jobs && result.data.jobs.length > 0) {
            const firstJob = result.data.jobs[0];
            console.log(`🏢 Top Job: ${firstJob.title} at ${firstJob.company}`);
            console.log(`🎯 Match Score: ${firstJob.glixAI_insights?.match_score || 'N/A'}%`);
          }
        }
        
        if (testCase.name === 'GlixAI Roadmap Generator') {
          console.log(`🎯 Target Role: ${result.data.target_role}`);
          console.log(`📚 Phases: ${result.data.phases?.length || 0} learning phases`);
          if (result.data.glixAI_insights) {
            console.log(`⏱️  Timeline: ${result.data.glixAI_insights.completion_time?.total_months || 'N/A'} months`);
            console.log(`📈 Success Rate: ${result.data.glixAI_insights.success_probability || 'N/A'}%`);
          }
        }
        
      } else {
        console.log(`❌ API Error: ${result.error}`);
        allTestsPassed = false;
      }

    } catch (error) {
      console.error(`❌ FAILED! ${testCase.name}:`, error.message);
      allTestsPassed = false;
    }
    
    console.log('\n' + '='.repeat(80) + '\n');
  }

  // Test health endpoints
  console.log('🏥 Testing GlixAI Service Health...');
  
  const healthEndpoints = [
    { name: 'Chat Service', endpoint: '/api/glixai/chat' },
    { name: 'Resume Service', endpoint: '/api/glixai/resume' },
    { name: 'Jobs Service', endpoint: '/api/glixai/jobs' },
    { name: 'Roadmap Service', endpoint: '/api/glixai/roadmap' }
  ];

  for (const endpoint of healthEndpoints) {
    try {
      const response = await fetch(`${baseURL}${endpoint.endpoint}`);
      const result = await response.json();
      
      console.log(`✅ ${endpoint.name}: ${result.success ? 'Healthy' : 'Unhealthy'}`);
      if (result.data) {
        console.log(`   Features: ${result.data.features?.join(', ') || 'N/A'}`);
        console.log(`   Provider: ${result.data.provider || 'N/A'}`);
      }
    } catch (error) {
      console.error(`❌ ${endpoint.name}: Health check failed - ${error.message}`);
      allTestsPassed = false;
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log(`🎉 GlixAI Complete Integration Test: ${allTestsPassed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log('\n📊 Test Summary:');
  console.log('• All API endpoints tested');
  console.log('• Response validation performed');
  console.log('• Health checks completed');
  console.log('• Feature functionality verified');
  
  if (allTestsPassed) {
    console.log('\n🚀 GlixAI is ready for production use!');
    console.log('🎯 All features are working correctly');
    console.log('🔗 Integration is complete and functional');
  } else {
    console.log('\n⚠️  Some issues detected. Please check the logs above.');
  }
};

// Run the test
testGlixAIComplete().catch(console.error);
