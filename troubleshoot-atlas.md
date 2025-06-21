# Atlas Integration Troubleshooting Guide

## Current Issues & Solutions

### 1. Supabase Edge Function Configuration

**Issue**: The webhook handler was a template, not properly configured.

**Solution**: ✅ Fixed - Updated `supabase/functions/webhook-handler/index.ts` with proper CORS handling and n8n proxy functionality.

**Next Steps**:
1. Update the `N8N_WEBHOOK_URL` in your `.env` file with your actual n8n webhook URL
2. Deploy the updated function: `supabase functions deploy webhook-handler`

### 2. Environment Configuration

**Issue**: Missing environment variables for Supabase integration.

**Solution**: ✅ Fixed - Created `.env` file with necessary Supabase credentials.

**Required Variables**:
```env
VITE_SUPABASE_URL=https://sxxfwwehrnczhgudwutq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4eGZ3d2Vocm5jemhndWR3dXRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMjQ4MTQsImV4cCI6MjA2MzYwMDgxNH0.bd1NUhxQR4BSY57qqxlBB18opsQq63iH7VCt6iWp5qE
N8N_WEBHOOK_URL=https://your-actual-n8n-instance.com/webhook/design-agent-webhook
```

### 3. n8n Workflow Analysis

**Current Setup**: Your Atlas workflow is active and properly configured with:
- Webhook ID: `aac3aed4-c2e7-495b-83d0-b09577adcc61`
- OpenAI integration for text and audio processing
- Supabase storage for audio files
- Proper response formatting

**Issues to Address**:

#### A. Response Format for Bolt
The workflow has two response paths:
1. **Text Response**: `Respond to Webhook (Text)` - Returns JSON with `response` and `audioUrl`
2. **Audio Response**: `Respond to Webhook` - Returns JSON with `response` and `audioUrl`

**Potential Issue**: Bolt might not be receiving the audio URL properly.

#### B. 404 Errors from Supabase REST
The workflow makes requests to:
- `https://sxxfwwehrnczhgudwutq.supabase.co/rest/v1/webhook_logs`
- `https://sxxfwwehrnczhgudwutq.supabase.co/functions/v1/webhook-handler`

**Solution**: Ensure these endpoints exist in your Supabase project.

## Step-by-Step Testing Plan

### Step 1: Verify Internet Connection
```bash
# Test basic connectivity
ping google.com
curl -I https://sxxfwwehrnczhgudwutq.supabase.co
```

### Step 2: Test Supabase Edge Function
```bash
# Deploy the function
supabase functions deploy webhook-handler

# Test locally
curl -X POST http://127.0.0.1:54321/functions/v1/webhook-handler \
  -H "Content-Type: application/json" \
  -d '{"message":"test message"}'
```

### Step 3: Test n8n Webhook Directly
```bash
# Replace with your actual n8n webhook URL
curl -X POST https://your-n8n-instance.com/webhook/design-agent-webhook \
  -H "Content-Type: application/json" \
  -d '{"message":"test message", "userId":"test-user"}'
```

### Step 4: Test End-to-End Flow
1. Send a message in Bolt
2. Check n8n executions dashboard
3. Check Supabase logs
4. Verify response format

## Debugging Commands

### Check Supabase Logs
```bash
supabase logs --follow
```

### Check n8n Executions
- Go to your n8n dashboard
- Check the "Executions" tab
- Look for failed executions

### Test Bolt Integration
```bash
# Test the proxy endpoint
curl -X POST https://sxxfwwehrnczhgudwutq.supabase.co/functions/v1/webhook-handler \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello Atlas", "userId":"test-user"}'
```

## Expected Response Format

The n8n workflow should return:
```json
{
  "response": "AI generated response text",
  "audioUrl": "https://sxxfwwehrnczhgudwutq.supabase.co/storage/v1/object/atlas-files/audio/..."
}
```

## Common Issues & Solutions

### 1. CORS Errors
- ✅ Fixed in Edge Function
- Ensure Bolt is making requests to the correct endpoint

### 2. 404 Errors
- Check if Supabase tables exist (`webhook_logs`)
- Verify API keys are correct
- Ensure functions are deployed

### 3. Audio Not Playing
- Check if audio URL is being returned
- Verify Supabase storage bucket permissions
- Test audio URL directly in browser

### 4. Network Errors
- Check local internet connection
- Verify n8n instance is accessible
- Test with different network

## Next Actions

1. **Update n8n Webhook URL**: Replace placeholder in `.env` file
2. **Deploy Edge Function**: `supabase functions deploy webhook-handler`
3. **Test Each Component**: Follow the testing plan above
4. **Monitor Logs**: Watch Supabase and n8n logs during testing
5. **Verify Bolt Integration**: Test the complete flow

## Support Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [n8n Webhook Documentation](https://docs.n8n.io/integrations/builtin/trigger-nodes/n8n-nodes-base.webhook/)
- [Bolt Integration Guide](https://docs.bolt.com) 