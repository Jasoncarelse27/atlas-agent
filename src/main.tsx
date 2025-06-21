import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Mock API endpoint for testing
if (window.location.hostname === 'localhost') {
  const mockApiEndpoint = () => {
    const apiUrl = '/api';
    
    // Create a simple endpoint for n8n testing
    const testEndpoint = `${apiUrl}/webhook-test`;
    console.log(`Setting up mock API endpoint at ${testEndpoint}`);
    
    // Example mock response data
    const mockWebhookResponse = {
      success: true,
      message: 'Webhook received successfully',
      timestamp: new Date().toISOString()
    };
    
    // Log any webhook requests for testing
    window.addEventListener('fetch', (event) => {
      if (event instanceof FetchEvent && event.request.url.includes(testEndpoint)) {
        console.log('Received webhook test request:', event.request);
        
        event.respondWith(
          new Response(JSON.stringify(mockWebhookResponse), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        );
      }
    });
  };
  
  try {
    mockApiEndpoint();
  } catch (error) {
    console.warn('Could not set up mock API endpoints:', error);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);