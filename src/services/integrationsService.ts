import { VoiceCommand } from '../types';

interface N8nWebhookConfig {
  url: string;
  eventTypes: string[];
  secret?: string;
}

class IntegrationsService {
  private webhookConfigs: N8nWebhookConfig[] = [];
  
  // Register a new n8n webhook
  public registerN8nWebhook(config: N8nWebhookConfig): string {
    const id = `webhook_${Date.now()}`;
    this.webhookConfigs.push(config);
    console.log(`Registered new n8n webhook to ${config.url} for events: ${config.eventTypes.join(', ')}`);
    return id;
  }
  
  // Send data to all registered n8n webhooks that match the event type
  public async triggerWebhooks(eventType: string, data: any): Promise<boolean> {
    const eligibleWebhooks = this.webhookConfigs.filter(config => 
      config.eventTypes.includes(eventType) || config.eventTypes.includes('*')
    );
    
    if (eligibleWebhooks.length === 0) {
      console.log(`No webhooks registered for event type: ${eventType}`);
      return false;
    }
    
    let success = true;
    
    for (const webhook of eligibleWebhooks) {
      try {
        const response = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(webhook.secret && { 'X-Webhook-Secret': webhook.secret }),
          },
          body: JSON.stringify({
            eventType,
            timestamp: new Date().toISOString(),
            data,
          }),
        });
        
        if (!response.ok) {
          console.error(`Failed to send webhook to ${webhook.url}: ${response.statusText}`);
          success = false;
        }
      } catch (error) {
        console.error(`Error sending webhook to ${webhook.url}:`, error);
        success = false;
      }
    }
    
    return success;
  }
  
  // Send voice command to n8n
  public async sendVoiceCommandToN8n(command: VoiceCommand): Promise<boolean> {
    return this.triggerWebhooks('voice_command', command);
  }
  
  // API endpoint for n8n to send commands to this app
  public async handleIncomingN8nRequest(data: any): Promise<any> {
    console.log('Received request from n8n:', data);
    
    // Process different types of requests
    switch (data.action) {
      case 'get_workout':
        // Return workout data
        return {
          success: true,
          data: {
            // Mock workout data
          }
        };
      
      case 'set_reminder':
        // Set a reminder
        return {
          success: true,
          message: 'Reminder set successfully'
        };
      
      case 'track_progress':
        // Record user progress
        return {
          success: true,
          message: 'Progress tracked successfully'
        };
      
      default:
        return {
          success: false,
          error: 'Unknown action type'
        };
    }
  }
  
  // Setup API endpoints for n8n integration
  public setupApiEndpoints(app: any): void {
    // This would be implemented based on the backend framework
    console.log('Setting up API endpoints for n8n integration');
    
    // Example with express:
    // app.post('/api/n8n/webhook', (req, res) => {
    //   const result = this.handleIncomingN8nRequest(req.body);
    //   res.json(result);
    // });
  }
}

// Create a singleton instance
const integrationsService = new IntegrationsService();
export default integrationsService;