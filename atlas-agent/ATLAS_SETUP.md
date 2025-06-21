# Atlas n8n Setup Guide

This guide will help you set up n8n to work via `www.atlasagent.xyz` with proper SSL certificates and domain routing.

## 🚀 Quick Start

### Prerequisites

1. **Domain**: Make sure `atlasagent.xyz` points to your server
2. **Server**: Ubuntu/Debian server with root access
3. **Docker**: Will be installed automatically by the script

### Automated Setup

1. **Upload files to your server**:
   ```bash
   # Copy all project files to your server
   scp -r . user@your-server:/path/to/project/
   ```

2. **Run the deployment script**:
   ```bash
   ssh user@your-server
   cd /path/to/project
   sudo ./deploy-atlas.sh
   ```

3. **Access your n8n instance**:
   - n8n Admin: https://www.atlasagent.xyz/n8n/
   - Username: `admin`
   - Password: `atlas2024`

## 🔧 Manual Setup

If you prefer to set up manually, follow these steps:

### 1. Install Dependencies

```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose certbot python3-certbot-nginx
sudo systemctl start docker
sudo systemctl enable docker
```

### 2. Get SSL Certificates

```bash
sudo certbot certonly --standalone -d atlasagent.xyz -d www.atlasagent.xyz --non-interactive --agree-tos --email admin@atlasagent.xyz

# Copy certificates
sudo mkdir -p ssl
sudo cp /etc/letsencrypt/live/atlasagent.xyz/fullchain.pem ssl/
sudo cp /etc/letsencrypt/live/atlasagent.xyz/privkey.pem ssl/
```

### 3. Deploy Supabase Function

```bash
# Set environment variables
export SUPABASE_ACCESS_TOKEN=your_supabase_access_token
export SUPABASE_DB_PASSWORD=your_supabase_db_password

# Deploy the webhook handler
supabase functions deploy webhook-handler
```

### 4. Start Services

```bash
# Start all services
docker-compose -f docker-compose.prod.yml up -d
```

## 📋 Configuration Details

### n8n Configuration

The n8n service is configured with:
- **Webhook URL**: `https://www.atlasagent.xyz/webhook/design-agent-webhook`
- **Admin Interface**: `https://www.atlasagent.xyz/n8n/`
- **Authentication**: Basic auth with username `admin` and password `atlas2024`

### Nginx Routing

The nginx configuration routes:
- `/webhook/*` → n8n webhook service
- `/n8n/*` → n8n admin interface
- `/functions/v1/webhook-handler` → Supabase edge function
- `/*` → Main application

### Environment Variables

Key environment variables for n8n:
```env
N8N_WEBHOOK_URL=https://www.atlasagent.xyz
N8N_HOST=www.atlasagent.xyz
N8N_PORT=5678
N8N_PROTOCOL=https
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=atlas2024
```

## 🧪 Testing

Run the test script to verify your setup:

```bash
node test-atlas-setup.js
```

This will test:
- Domain resolution
- n8n admin interface accessibility
- n8n webhook functionality
- Supabase function connectivity

## 🔄 Import Atlas Workflow

1. **Access n8n Admin**: https://www.atlasagent.xyz/n8n/
2. **Login**: Use `admin` / `atlas2024`
3. **Import Workflow**: 
   - Go to Workflows → Import from File
   - Select your `atlas.json` file
4. **Update Webhook URL**: 
   - Open the webhook node
   - Update the webhook URL to: `https://www.atlasagent.xyz/webhook/design-agent-webhook`
5. **Activate Workflow**: Click the "Activate" button

## 🔗 Integration with Bolt

Your Bolt app should send requests to:
```
https://sxxfwwehrnczhgudwutq.supabase.co/functions/v1/webhook-handler
```

The Supabase function will:
1. Authenticate the user
2. Forward the request to n8n
3. Return the AI response

## 🔒 Security

### SSL Certificates
- Automatically renewed every 90 days
- Add to crontab for automatic renewal:
  ```bash
  0 12 * * * /usr/bin/certbot renew --quiet && docker-compose -f /path/to/project/docker-compose.prod.yml restart nginx
  ```

### n8n Security
- Basic authentication enabled
- Change default password after first login
- Consider enabling additional security measures

## 🐛 Troubleshooting

### Common Issues

1. **SSL Certificate Issues**:
   ```bash
   sudo certbot renew --force-renewal
   sudo docker-compose -f docker-compose.prod.yml restart nginx
   ```

2. **n8n Not Starting**:
   ```bash
   docker-compose -f docker-compose.prod.yml logs n8n
   ```

3. **Webhook Not Working**:
   - Check if workflow is active in n8n
   - Verify webhook URL in workflow
   - Check n8n execution logs

4. **Supabase Function Issues**:
   ```bash
   supabase functions logs webhook-handler
   ```

### Logs

View logs for different services:
```bash
# n8n logs
docker-compose -f docker-compose.prod.yml logs n8n

# nginx logs
docker-compose -f docker-compose.prod.yml logs nginx

# Supabase function logs
supabase functions logs webhook-handler
```

## 📞 Support

If you encounter issues:

1. Check the logs using the commands above
2. Run the test script: `node test-atlas-setup.js`
3. Verify your domain DNS settings
4. Ensure all ports (80, 443, 5678) are open in your firewall

## 🔄 Updates

To update your setup:

```bash
# Pull latest changes
git pull

# Restart services
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d

# Update Supabase function
supabase functions deploy webhook-handler
```

## 📊 Monitoring

Monitor your setup with:
- n8n execution dashboard
- Supabase function logs
- nginx access logs
- SSL certificate expiration

---

**Happy automating with Atlas! 🚀** 