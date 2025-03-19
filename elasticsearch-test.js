// elasticsearch-test.js
const { Client } = require('@elastic/elasticsearch');

const client = new Client({ 
  node: 'http://localhost:9200'
});

async function runTests() {
  try {
    // Basic connection test
    const info = await client.info();
    console.log('✅ Connected to Elasticsearch');
    console.log('   Version:', info.version.number);
    
    // Check if we can create an index
    const testIndex = 'test-index-' + Date.now();
    await client.indices.create({ index: testIndex });
    console.log(`✅ Successfully created test index: ${testIndex}`);
    
    // Add a document
    await client.index({
      index: testIndex,
      document: { test: 'document', timestamp: new Date() },
      refresh: true
    });
    console.log('✅ Added test document');
    
    // Clean up
    await client.indices.delete({ index: testIndex });
    console.log('✅ Deleted test index');
    
    console.log('\n🎉 All tests passed! Your Elasticsearch is working without authentication.');
    console.log('You can proceed with implementing your shopping list app without additional configuration.');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.message.includes('401')) {
      console.log('\n🔒 Elasticsearch requires authentication.');
      console.log('Try setting up credentials or disabling security if this is just for development.');
    }
  }
}

runTests();