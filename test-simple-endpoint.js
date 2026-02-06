const testSimpleEndpoint = async () => {
  console.log('🔬 Testing Simple Endpoint...\n');

  try {
    // Test basic import
    const { AdvancedScienceMatcher } = await import('/Users/macbookpro/Desktop/glixtron-pilot/lib/engine/matcher.js');
    console.log('✅ AdvancedScienceMatcher imported successfully');
    
    const matcher = new AdvancedScienceMatcher();
    console.log('✅ AdvancedScienceMatcher instantiated');
    
    const result = matcher.analyzeResume('test resume with Python and AI skills', 'general');
    console.log('✅ Analysis completed:', result);
    
  } catch (error) {
    console.error('❌ Import/Instantiation Error:', error.message);
  }
};

testSimpleEndpoint().catch(console.error);
