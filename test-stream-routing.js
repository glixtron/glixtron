const testStreamRouting = async () => {
  console.log('🧪 Testing Science-Stream Routing Accuracy...\n');

  const testCases = [
    {
      name: 'Biology Stream Test',
      stream: 'Biology',
      resumeText: `Jane Smith
Molecular Biology Researcher
Skills: PCR, DNA Sequencing, CRISPR, Cell Culture, Biochemistry, HPLC
Experience: Gene editing research, protein analysis, laboratory techniques
Education: BS Biology, Stanford University
Research: Published 3 papers on gene editing and molecular biology`,
      careerGoals: 'I want to work in biotechnology research',
      expectedKeywords: ['CRISPR', 'HPLC', 'molecular', 'gene', 'protein'],
      unexpectedKeywords: ['quantum', 'MATLAB', 'calculus']
    },
    {
      name: 'Physics Stream Test',
      stream: 'Physics', 
      resumeText: `John Doe
Physics Research Scientist
Skills: Quantum Mechanics, MATLAB, Python, Calculus, Thermodynamics, Statistical Analysis
Experience: Quantum computing research, computational physics, mathematical modeling
Education: PhD Physics, MIT
Research: Published 5 papers on quantum systems and theoretical physics`,
      careerGoals: 'I want to become a research physicist',
      expectedKeywords: ['quantum', 'MATLAB', 'physics', 'computational'],
      unexpectedKeywords: ['CRISPR', 'HPLC', 'gene', 'protein']
    }
  ];

  for (const testCase of testCases) {
    console.log(`🔬 Testing: ${testCase.name}`);
    console.log(`🎯 Selected Stream: ${testCase.stream}\n`);

    try {
      const response = await fetch('http://localhost:3000/api/career-guidance/integrated', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText: testCase.resumeText,
          careerGoals: testCase.careerGoals,
          selectedStream: testCase.stream
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const responseText = JSON.stringify(result).toLowerCase();
      
      console.log('✅ Response received:');
      console.log(`🔍 Detected Stream: ${result.data?.detectedStream?.primaryStream}`);
      console.log(`🎯 Target Roles: ${result.data?.targetRoles?.slice(0, 3).join(', ')}`);
      
      // Check for expected keywords
      const foundExpected = testCase.expectedKeywords.filter(keyword => 
        responseText.includes(keyword.toLowerCase())
      );
      
      // Check for unexpected keywords
      const foundUnexpected = testCase.unexpectedKeywords.filter(keyword => 
        responseText.includes(keyword.toLowerCase())
      );
      
      console.log(`\n📊 Keyword Analysis:`);
      console.log(`✅ Expected keywords found: ${foundExpected.length}/${testCase.expectedKeywords.length}`);
      if (foundExpected.length > 0) {
        console.log(`   Found: ${foundExpected.join(', ')}`);
      }
      
      console.log(`❌ Unexpected keywords found: ${foundUnexpected.length}/${testCase.unexpectedKeywords.length}`);
      if (foundUnexpected.length > 0) {
        console.log(`   Found: ${foundUnexpected.join(', ')}`);
      }
      
      // Check critical gaps for stream-specific content
      const criticalGaps = result.data?.skillGapAnalysis?.criticalGaps || [];
      console.log(`\n⚠️  Critical Gaps (${criticalGaps.length}):`);
      criticalGaps.slice(0, 3).forEach(gap => console.log(`   - ${gap}`));
      
      // Evaluate routing accuracy
      const expectedFound = foundExpected.length >= testCase.expectedKeywords.length * 0.6; // 60% of expected
      const unexpectedFound = foundUnexpected.length <= testCase.unexpectedKeywords.length * 0.3; // Max 30% unexpected
      
      const routingAccuracy = expectedFound && !unexpectedFound;
      
      console.log(`\n🎯 Routing Accuracy: ${routingAccuracy ? '✅ PASS' : '❌ FAIL'}`);
      
      if (!routingAccuracy) {
        if (!expectedFound) {
          console.log(`   Issue: Not enough expected keywords found`);
        }
        if (unexpectedFound) {
          console.log(`   Issue: Unexpected keywords detected (possible cross-contamination)`);
        }
      }

    } catch (error) {
      console.error(`❌ FAILED! ${testCase.name}:`, error.message);
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
  }

  console.log('🎉 Stream Routing Test Complete!');
};

// Run the test
testStreamRouting().catch(console.error);
