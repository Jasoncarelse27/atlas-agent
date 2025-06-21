// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

// Get n8n webhook URL from environment variable
const N8N_WEBHOOK_URL = 'https://7d15-197-185-189-84.ngrok-free.app/webhook/'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get the request body
    const body = await req.json()
    
    console.log('Received webhook request for user:', user.id);
    console.log('Forwarding to n8n URL:', N8N_WEBHOOK_URL);
    
    // Add user ID to the body being forwarded to n8n
    const forwardBody = { ...body, userId: user.id };

    // Forward the request to n8n
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(forwardBody),
    })

    if (!n8nResponse.ok) {
      console.error('n8n request failed:', n8nResponse.status, n8nResponse.statusText)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to process request',
          status: n8nResponse.status 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get the response from n8n
    const n8nData = await n8nResponse.json()
    console.log('n8n response:', JSON.stringify(n8nData, null, 2))

    // Return the response from n8n
    return new Response(
      JSON.stringify(n8nData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request with an Authorization header:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/webhook-handler' \
    --header 'Authorization: Bearer YOUR_SUPABASE_JWT' \
    --header 'Content-Type: application/json' \
    --data '{"message":"Hello from Bolt"}'

*/
