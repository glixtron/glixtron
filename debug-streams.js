const debugStreams = async () => {
  console.log('🔍 Debugging Stream Routing...\n');

  const biologyTest = {
    stream: 'Biology',
    resumeText: 'Skills: PCR, DNA Sequencing, CRISPR, Cell Culture, Biochemistry, HPLC',
    careerGoals: 'biotechnology research'
  };

  const physicsTest = {
    stream: 'Physics',
    resumeText: 'Skills: Quantum Mechanics, MATLAB, Python, Calculus, Thermodynamics',
    careerGoals: 'physics research'
  };

  try {
    // Test Biology
    console.log('🧪 Testing Biology Stream:');
    const bioResponse = await fetch('http://localhost:3000/api/career-guidance/integrated', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(biologyTest)
    });
    
    const bioResult = await bioResponse.json();
    const bioGaps = bioResult.data?.skillGapAnalysis?.criticalGaps || [];
    console.log(`   Critical Gaps: ${bioGaps.join(', ')}`);
    console.log(`   Target Roles: ${bioResult.data?.targetRoles?.join(', ')}`);

    // Test Physics
    console.log('\n⚛️  Testing Physics Stream:');
    const physicsResponse = await fetch('http://localhost:3000/api/career-guidance/integrated', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(physicsTest)
    });
    
    const physicsResult = await physicsResponse.json();
    const physicsGaps = physicsResult.data?.skillGapAnalysis?.criticalGaps || [];
    console.log(`   Critical Gaps: ${physicsGaps.join(', ')}`);
    console.log(`   Target Roles: ${physicsResult.data?.targetRoles?.join(', ')}`);

    // Check for cross-contamination
    const bioHasPhysics = bioGaps.some(gap => gap.toLowerCase().includes('quantum') || gap.toLowerCase().includes('matlab'));
    const physicsHasBiology = physicsGaps.some(gap => gap.toLowerCase().includes('crispr') || gap.toLowerCase().includes('hplc'));

    console.log('\n🔍 Cross-Contamination Check:');
    console.log(`   Biology has physics terms: ${bioHasPhysics ? '❌ YES' : '✅ NO'}`);
    console.log(`   Physics has biology terms: ${physicsHasBiology ? '❌ YES' : '✅ NO'}`);

    if (!bioHasPhysics && !physicsHasBiology) {
      console.log('\n✅ Stream routing is working correctly!');
    } else {
      console.log('\n❌ Cross-contamination detected!');
    }

  } catch (error) {
    console.error('❌ Debug test failed:', error.message);
  }
};

debugStreams().catch(console.error);
