// Comprehensive AI System Testing Script
// Tests all AI providers, outputs, and integrations

console.log('🤖 COMPREHENSIVE AI SYSTEM TESTING\n');

// Test 1: Check AI Provider Configuration
console.log('1. 🔍 Checking AI Provider Configuration...');
const aiProviders = [
  { name: 'Gemini', key: 'GEMINI_API_KEY', required: true },
  { name: 'DeepSeek', key: 'DEEPSEEK_API_KEY', required: true },
  { name: 'Firecrawl', key: 'FIRECRAWL_API_KEY', required: false }
];

let configIssues = [];
aiProviders.forEach(provider => {
  const hasKey = process.env[provider.key];
  const status = hasKey ? '✅' : '❌';
  const required = provider.required ? ' (required)' : ' (optional)';
  console.log(`${status} ${provider.name}: ${provider.key}${required}`);
  if (provider.required && !hasKey) {
    configIssues.push(`${provider.name} API key missing`);
  }
});

// Test 2: Test API Endpoints
console.log('\n2. 🌐 Testing AI API Endpoints...');
const endpoints = [
  { path: '/api/career-guidance', name: 'Career Guidance Main' },
  { path: '/api/career/deepseek', name: 'DeepSeek Career Analysis' },
  { path: '/api/jd-extractor-enhanced', name: 'JD Extractor Enhanced' },
  { path: '/api/resume/analyze-enhanced', name: 'Resume Analysis' }
];

const testEndpoint = async (endpoint) => {
  try {
    const response = await fetch(`http://localhost:3000${endpoint.path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'test',
        message: 'AI system test'
      })
    });
    
    const status = response.ok ? '✅' : '❌';
    const statusCode = response.status;
    console.log(`${status} ${endpoint.name}: ${statusCode} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   Response structure: ${Object.keys(data).join(', ')}`);
    }
    
    return { success: response.ok, status: statusCode, data };
  } catch (error) {
    console.log(`❌ ${endpoint.name}: Connection failed - ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Test 3: Test DeepSeek Output Format
console.log('\n3. 🧠 Testing DeepSeek Output Format...');
const testDeepSeekOutput = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/career/deepseek', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resumeText: 'Software Engineer with 5 years experience in React, Node.js, and cloud technologies. Looking for senior developer roles.',
        assessmentData: {
          coreSkills: ['JavaScript', 'React', 'Node.js'],
          softSkills: ['Leadership', 'Communication'],
          remotePreference: 80,
          startupPreference: 60
        }
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ DeepSeek Response Structure:');
      console.log('   Success:', data.success);
      console.log('   Has Data:', !!data.data);
      
      if (data.data) {
        console.log('   Response Keys:', Object.keys(data.data));
        console.log('   Career Map:', !!data.data.careerMap);
        console.log('   Recommended Roles:', !!data.data.recommendedRoles);
        console.log('   Skill Gaps:', !!data.data.skillGaps);
        console.log('   Next Steps:', !!data.data.nextSteps);
        
        // Validate expected structure
        const expectedKeys = ['careerMap', 'recommendedRoles', 'skillGaps', 'nextSteps'];
        const actualKeys = Object.keys(data.data);
        const missingKeys = expectedKeys.filter(key => !actualKeys.includes(key));
        
        if (missingKeys.length === 0) {
          console.log('✅ DeepSeek output structure is correct');
        } else {
          console.log('❌ Missing keys in DeepSeek output:', missingKeys);
        }
      }
    } else {
      console.log('❌ DeepSeek API call failed');
    }
  } catch (error) {
    console.log('❌ DeepSeek test error:', error.message);
  }
};

// Test 4: Test JD Extractor with DeepSeek
console.log('\n4. 📄 Testing JD Extractor with DeepSeek...');
const testJDExtractor = async () => {
  try {
    const testUrl = 'https://www.linkedin.com/jobs/view/software-engineer-at-microsoft-123456789';
    
    const formData = new FormData();
    formData.append('action', 'extract-url');
    formData.append('url', testUrl);
    
    const response = await fetch('http://localhost:3000/api/jd-extractor-enhanced', {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ JD Extractor Response:');
      console.log('   Success:', data.success);
      console.log('   Has Extracted Content:', !!data.data?.extractedContent);
      console.log('   Has AI Analysis:', !!data.data?.aiAnalysis);
      
      if (data.data?.aiAnalysis) {
        console.log('   AI Analysis Keys:', Object.keys(data.data.aiAnalysis));
      }
    } else {
      console.log('❌ JD Extractor API call failed');
    }
  } catch (error) {
    console.log('❌ JD Extractor test error:', error.message);
  }
};

// Test 5: Test Resume Analysis AI Integration
console.log('\n5. 📄 Testing Resume Analysis AI Integration...');
const testResumeAnalysis = async () => {
  try {
    const formData = new FormData();
    
    // Create a test resume file content
    const testResumeContent = `John Doe
Software Engineer
Email: john@example.com | Phone: (555) 123-4567

SUMMARY
Experienced software engineer with 5 years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies.

EXPERIENCE
Senior Software Engineer | Tech Corp | 2020-Present
- Led development of microservices architecture serving 1M+ users
- Implemented CI/CD pipelines reducing deployment time by 60%
- Mentored junior developers and conducted code reviews

Software Engineer | StartupXYZ | 2018-2020
- Built React applications with TypeScript and Redux
- Developed RESTful APIs using Node.js and Express
- Collaborated with cross-functional teams in Agile environment

SKILLS
- Languages: JavaScript, TypeScript, Python, Java
- Frameworks: React, Node.js, Express, Django
- Databases: MongoDB, PostgreSQL, MySQL
- Cloud: AWS, Google Cloud, Azure
- Tools: Docker, Kubernetes, Git, Jenkins`;

    const blob = new Blob([testResumeContent], { type: 'text/plain' });
    formData.append('resume', blob, 'test-resume.txt');
    
    const response = await fetch('http://localhost:3000/api/resume/analyze-enhanced', {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Resume Analysis Response:');
      console.log('   Success:', data.success);
      console.log('   Has Analysis:', !!data.data);
      
      if (data.data) {
        console.log('   Analysis Keys:', Object.keys(data.data));
        console.log('   Overall Score:', data.data.overallScore);
        console.log('   ATS Score:', data.data.atsScore);
        console.log('   Content Score:', data.data.contentScore);
        console.log('   Structure Score:', data.data.structureScore);
        console.log('   Interview Likelihood:', data.data.interviewLikelihood);
        console.log('   Has Critical Issues:', !!data.data.criticalIssues?.length);
        console.log('   Has Improvements:', !!data.data.improvements?.length);
        console.log('   Has Missing Keywords:', !!data.data.missingKeywords?.length);
      }
    } else {
      console.log('❌ Resume Analysis API call failed');
    }
  } catch (error) {
    console.log('❌ Resume Analysis test error:', error.message);
  }
};

// Test 6: Test Career Guidance with AI Persona
console.log('\n6. 🤖 Testing Career Guidance with AI Persona...');
const testCareerGuidance = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/career-guidance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'query',
        studentProfile: {
          name: 'Test Student',
          education: 'Bachelor in Computer Science',
          experience: '2 years',
          skills: ['JavaScript', 'React', 'Node.js'],
          interests: ['AI', 'Machine Learning', 'Cloud Computing']
        },
        assessmentResults: {
          coreSkills: ['Problem Solving', 'Programming'],
          softSkills: ['Communication', 'Teamwork'],
          remotePreference: 75,
          startupPreference: 50
        },
        query: 'What career path should I pursue?'
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Career Guidance Response:');
      console.log('   Success:', data.success);
      console.log('   Has Response:', !!data.data?.response);
      console.log('   Has Roadmap Update:', !!data.data?.response?.includes('ROADMAP_UPDATE'));
      
      if (data.data?.response) {
        // Check for AI persona elements
        const responseText = data.data.response;
        const hasGreeting = responseText.toLowerCase().includes('hello');
        const hasSignoff = responseText.toLowerCase().includes('regards') || responseText.toLowerCase().includes('sincerely');
        const hasStructuredAdvice = responseText.includes('###') || responseText.includes('1.') || responseText.includes('•');
        
        console.log('   Has AI Persona Greeting:', hasGreeting);
        console.log('   Has AI Persona Signoff:', hasSignoff);
        console.log('   Has Structured Advice:', hasStructuredAdvice);
      }
    } else {
      console.log('❌ Career Guidance API call failed');
    }
  } catch (error) {
    console.log('❌ Career Guidance test error:', error.message);
  }
};

// Run all tests
const runAllTests = async () => {
  console.log('🚀 Starting comprehensive AI system tests...\n');
  
  // Test endpoints
  console.log('Testing API Endpoints:');
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
  }
  
  // Test specific AI features
  await testDeepSeekOutput();
  await testJDExtractor();
  await testResumeAnalysis();
  await testCareerGuidance();
  
  // Summary
  console.log('\n📊 TEST SUMMARY:');
  console.log('Configuration Issues:', configIssues.length);
  if (configIssues.length > 0) {
    console.log('❌ Issues to fix:', configIssues.join(', '));
  } else {
    console.log('✅ All AI providers configured correctly');
  }
  
  console.log('\n🎯 RECOMMENDATIONS:');
  console.log('1. Ensure all required API keys are set in environment variables');
  console.log('2. Test with real data to validate AI output quality');
  console.log('3. Monitor AI response times and error rates');
  console.log('4. Implement proper error handling for AI failures');
  console.log('5. Add logging for AI debugging and monitoring');
};

// Execute tests
runAllTests().catch(error => {
  console.error('❌ Test execution failed:', error);
});
