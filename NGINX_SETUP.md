# Nginx Setup Guide for Next.js Frontend

This guide explains how to configure Nginx as a reverse proxy for your Next.js frontend application.

## Prerequisites

- Ubuntu/Debian server (or similar Linux distribution)
- Root/sudo access
- Domain name pointing to your server IP
- Next.js app running on port 3000

## Quick Setup (Automated)

### 1. Run the setup script

```bash
# Download and run the setup script
wget -O - https://raw.githubusercontent.com/your-repo/setup-nginx.sh | bash

# Or if you have the script locally:
sudo ./setup-nginx.sh
```

The script will:
- Install Nginx if not already installed
- Create nginx configuration
- Enable the site
- Test configuration
- Restart Nginx

### 2. Get SSL Certificate (Recommended)

Use Certbot for free Let's Encrypt SSL:

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal (runs twice daily)
sudo systemctl enable certbot.timer
```

### 3. Verify Setup

```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/your-domain.com.access.log
sudo tail -f /var/log/nginx/your-domain.com.error.log

# Test your site
curl -I http://your-domain.com
curl -I https://your-domain.com
```

## Manual Setup

### 1. Install Nginx

```bash
sudo apt-get update
sudo apt-get install nginx
```

### 2. Create Nginx Configuration

Create a new configuration file:

```bash
sudo nano /etc/nginx/sites-available/nextjs-app
```

Paste the configuration from `nginx.conf` or `nginx-simple.conf` (adjust domain name and paths).

### 3. Enable the Site

```bash
sudo ln -s /etc/nginx/sites-available/nextjs-app /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default  # Remove default config
```

### 4. Test and Restart

```bash
# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## Configuration Files

### nginx.conf (Full Configuration)

Features:
- HTTP to HTTPS redirect
- SSL/TLS with security headers
- Gzip compression
- Static file caching
- Rate limiting
- Security headers (CSP, HSTS, etc.)
- Health check endpoint
- Access/error logging

### nginx-simple.conf (Basic Configuration)

Features:
- HTTP proxy to Next.js
- Static file caching
- Gzip compression
- Basic security headers
- Logging

Use this for quick setup, then enhance as needed.

## Docker Setup

### Using docker-compose-with-nginx.yml

```bash
# Create SSL directory
mkdir -p ssl

# Place your SSL certificates in ssl/ directory
# ssl/your-domain.com.crt
# ssl/your-domain.com.key

# Update nginx.conf with correct SSL paths:
# ssl_certificate /etc/ssl/certs/your-domain.com.crt;
# ssl_certificate_key /etc/ssl/private/your-domain.com.key;

# Run with nginx
docker-compose -f docker-compose-with-nginx.yml up -d

# View logs
docker-compose -f docker-compose-with-nginx.yml logs -f
```

## SSL Certificate Options

### Option 1: Let's Encrypt (Free, Recommended)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test renewal
sudo certbot renew --dry-run
```

### Option 2: Self-Signed (For Testing)

```bash
# Generate self-signed certificate
sudo mkdir -p /etc/ssl/private
sudo mkdir -p /etc/ssl/certs

sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/your-domain.com.key \
  -out /etc/ssl/certs/your-domain.com.crt \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=your-domain.com"

# Update nginx.conf with these paths
```

### Option 3: Commercial SSL

Purchase SSL from:
- GoDaddy
- Namecheap
- DigiCert
- etc.

Upload certificate and key to:
- `/etc/ssl/certs/your-domain.com.crt`
- `/etc/ssl/private/your-domain.com.key`

## Next.js Configuration

### Ensure Next.js is Running

```bash
# Option 1: Using PM2 (Recommended for production)
npm install -g pm2
pm2 start npm --name "nextjs" -- start
pm2 startup
pm2 save

# Option 2: Using systemd
sudo nano /etc/systemd/system/nextjs.service
```

### systemd Service File

```ini
[Unit]
Description=Next.js Frontend
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/your/project/frontend
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable nextjs
sudo systemctl start nextjs
sudo systemctl status nextjs
```

## Security Best Practices

### 1. Firewall Configuration

```bash
# Allow only necessary ports
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp  # SSH
sudo ufw enable
```

### 2. Nginx Security Headers

The configuration includes:
- `Strict-Transport-Security` (HSTS)
- `X-Frame-Options` (Clickjacking protection)
- `X-Content-Type-Options` (MIME sniffing protection)
- `X-XSS-Protection` (XSS protection)
- `Referrer-Policy` (Privacy)
- `Content-Security-Policy` (CSP)

### 3. Rate Limiting

Nginx configuration includes rate limiting:
- API routes: 10 requests/second
- General routes: 100 requests/second

### 4. Hide Nginx Version

```nginx
server_tokens off;
```

### 5. SSL Security

- Use TLSv1.2 and TLSv1.3 only
- Strong cipher suites
- OCSP stapling (when using real SSL)

## Performance Optimization

### 1. Gzip Compression

Enabled for:
- Text files (HTML, CSS, JS)
- JSON
- Fonts
- SVG

### 2. Caching

Static assets cached for 1 year:
```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Keepalive Connections

```nginx
upstream nextjs_app {
    server 127.0.0.1:3000;
    keepalive 32;
}
```

### 4. Buffer Sizes

```nginx
proxy_buffer_size 128k;
proxy_buffers 4 256k;
proxy_busy_buffers_size 256k;
```

## Monitoring & Logging

### View Logs

```bash
# Nginx access log
sudo tail -f /var/log/nginx/your-domain.com.access.log

# Nginx error log
sudo tail -f /var/log/nginx/your-domain.com.error.log

# Next.js logs
sudo journalctl -u nextjs -f
# or
pm2 logs nextjs
```

### Log Rotation

Create `/etc/logrotate.d/nginx`:

```nginx
/var/log/nginx/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        if [ -f /var/run/nginx.pid ]; then
            kill -USR1 `cat /var/run/nginx.pid`
        fi
    endscript
}
```

## Troubleshooting

### 1. Nginx Won't Start

```bash
# Check configuration
sudo nginx -t

# Check logs
sudo journalctl -u nginx -f

# Check port usage
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443
```

### 2. 502 Bad Gateway

- Next.js app is not running
- Wrong port in nginx config
- Firewall blocking connection

```bash
# Check if Next.js is running
curl https://bodymetrics.ru

# Check nginx upstream
sudo nginx -T | grep upstream
```

### 3. SSL Errors

```bash
# Check certificate paths
sudo ls -la /etc/ssl/certs/
sudo ls -la /etc/ssl/private/

# Check certificate validity
sudo openssl x509 -in /etc/ssl/certs/your-domain.com.crt -text -noout
```

### 4. Slow Performance

- Check nginx error log
- Increase buffer sizes
- Enable more aggressive caching
- Check server resources (CPU, RAM)

## Advanced Configuration

### 1. Load Balancing

```nginx
upstream nextjs_backend {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
    keepalive 32;
}
```

### 2. WebSocket Support

```nginx
location / {
    proxy_pass http://nextjs_app;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
}
```

### 3. CORS Configuration

```nginx
add_header Access-Control-Allow-Origin "https://your-domain.com" always;
add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;
```

### 4. Rate Limiting Zones

```nginx
# API rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

# General rate limiting
limit_req_zone $binary_remote_addr zone=general:10m rate=100r/s;

# Apply limits
location /api/ {
    limit_req zone=api burst=20 nodelay;
    # ...
}
```

## Maintenance

### Update Nginx

```bash
sudo apt-get update
sudo apt-get upgrade nginx
sudo systemctl restart nginx
```

### Renew SSL Certificates

```bash
# Manual renewal
sudo certbot renew

# Auto-renewal (runs twice daily)
sudo systemctl status certbot.timer
```

### Backup Configuration

```bash
# Backup nginx config
sudo tar -czf nginx-backup-$(date +%Y%m%d).tar.gz /etc/nginx/

# Backup SSL certificates
sudo tar -czf ssl-backup-$(date +%Y%m%d).tar.gz /etc/ssl/
```

## Common Commands

```bash
# Start Nginx
sudo systemctl start nginx

# Stop Nginx
sudo systemctl stop nginx

# Restart Nginx
sudo systemctl restart nginx

# Reload Nginx (graceful)
sudo systemctl reload nginx

# Enable Nginx on boot
sudo systemctl enable nginx

# Check Nginx status
sudo systemctl status nginx

# Test configuration
sudo nginx -t

# View Nginx version
nginx -v

# View active connections
sudo nginx -T | grep active
```

## Resources

- [Nginx Documentation](https://nginx.org/en/docs/)
- [Nginx Reverse Proxy Guide](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Certbot Documentation](https://certbot.eff.org/)
- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)

## Support

If you encounter issues:

1. Check Nginx logs: `/var/log/nginx/`
2. Check Next.js logs: `pm2 logs` or `journalctl -u nextjs`
3. Test configuration: `sudo nginx -t`
4. Verify ports: `sudo netstat -tulpn | grep -E ':(80|443|3000)'`

---

**Last Updated**: January 2026
**Version**: 1.0
