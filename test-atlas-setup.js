#!/usr/bin/env node

/**
 * Atlas Integration Test Script
 * 
 * This script tests the various components of your Atlas integration:
 * 1. Supabase connectivity
 * 2. Edge Function deployment
 * 3. n8n webhook accessibility
 * 4. End-to-end flow
 */

const https = require('https');
const http = require('http');

// Test configuration
const config = {
  n8nWebhookUrl: 'https://www.atlasagent.xyz/webhook/design-agent-webhook',
  supabaseFunctionUrl: 'https://sxxfwwehrnczhgudwutq.supabase.co/functions/v1/webhook-handler',
  n8nAdminUrl: 'https://www.atlasagent.xyz/n8n/',
  testMessage: {
    message: 'Hello Atlas, this is a test message',
    userId: 'test-user-123'
  }
};

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

// Test functions
async function testN8nWebhook() {
  console.log('🧪 Testing n8n webhook...');
  try {
    const response = await makeRequest(config.n8nWebhookUrl, {
      method: 'POST',
      body: config.testMessage
    });
    
    console.log(`✅ n8n Webhook Status: ${response.status}`);
    console.log(`📄 Response: ${response.data.substring(0, 200)}...`);
    return true;
  } catch (error) {
    console.log(`❌ n8n Webhook Error: ${error.message}`);
    return false;
  }
}

async function testSupabaseFunction() {
  console.log('🧪 Testing Supabase function...');
  try {
    const response = await makeRequest(config.supabaseFunctionUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_SUPABASE_JWT' // Replace with actual JWT
      },
      body: config.testMessage
    });
    
    console.log(`✅ Supabase Function Status: ${response.status}`);
    console.log(`📄 Response: ${response.data.substring(0, 200)}...`);
    return true;
  } catch (error) {
    console.log(`❌ Supabase Function Error: ${error.message}`);
    return false;
  }
}

async function testN8nAdmin() {
  console.log('🧪 Testing n8n admin interface...');
  try {
    const response = await makeRequest(config.n8nAdminUrl);
    
    console.log(`✅ n8n Admin Status: ${response.status}`);
    if (response.status === 200) {
      console.log('✅ n8n Admin interface is accessible');
    } else {
      console.log('⚠️  n8n Admin interface returned non-200 status');
    }
    return response.status === 200;
  } catch (error) {
    console.log(`❌ n8n Admin Error: ${error.message}`);
    return false;
  }
}

async function testDomainResolution() {
  console.log('🧪 Testing domain resolution...');
  const domains = [
    'www.atlasagent.xyz',
    'atlasagent.xyz'
  ];
  
  for (const domain of domains) {
    try {
      const response = await makeRequest(`https://${domain}`);
      console.log(`✅ ${domain} - Status: ${response.status}`);
    } catch (error) {
      console.log(`❌ ${domain} - Error: ${error.message}`);
    }
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting Atlas Integration Tests');
  console.log('=====================================\n');
  
  const results = {
    domainResolution: await testDomainResolution(),
    n8nAdmin: await testN8nAdmin(),
    n8nWebhook: await testN8nWebhook(),
    supabaseFunction: await testSupabaseFunction()
  };
  
  console.log('\n📊 Test Results Summary');
  console.log('=======================');
  console.log(`Domain Resolution: ${results.domainResolution ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`n8n Admin Interface: ${results.n8nAdmin ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`n8n Webhook: ${results.n8nWebhook ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Supabase Function: ${results.supabaseFunction ? '✅ PASS' : '❌ FAIL'}`);
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Your Atlas n8n setup is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the configuration and try again.');
  }
  
  console.log('\n📝 Next Steps:');
  console.log('1. If n8n webhook failed, make sure your workflow is active in n8n');
  console.log('2. If Supabase function failed, check your JWT token and function deployment');
  console.log('3. Import your Atlas workflow into n8n if not already done');
  console.log('4. Test the integration with your Bolt app');
}

// Run the tests
runTests().catch(console.error);

export { runTests, config }; 