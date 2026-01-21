# Quick Start: Deploy Next.js Frontend to Server

## 5-Minute Setup Guide

### Prerequisites
- Ubuntu 20.04/22.04 server
- Root/sudo access
- Domain name (optional)

---

## Step 1: Connect to Server

```bash
ssh root@your-server-ip
```

---

## Step 2: Run Setup Script

```bash
# Update system
apt-get update && apt-get upgrade -y

# Install git
apt-get install -y git

# Clone your repository
git clone https://github.com/your-username/your-repo.git
cd your-repo

# Make scripts executable
chmod +x setup-nginx.sh

# Run nginx setup
sudo ./setup-nginx.sh
```

When prompted, enter your domain name (e.g., `bodymetrics.ru`).

---

## Step 3: Setup Node.js & PM2

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Install Node.js 20
nvm install 20
nvm use 20

# Install PM2
npm install -g pm2
```

---

## Step 4: Deploy Application

```bash
# Go to frontend directory
cd frontend

# Install dependencies
npm install

# Build application
npm run build

# Start with PM2
pm2 start npm --name "nextjs-frontend" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

---

## Step 5: Get SSL Certificate

```bash
# Install Certbot
apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## Step 6: Verify Everything

```bash
# Check PM2 status
pm2 status

# Check Nginx status
systemctl status nginx

# Test your site
curl -I https://your-domain.com
```

---

## Done! 🎉

Your site should now be live at `https://your-domain.com`

---

## Common Commands

### Update Application
```bash
cd ~/your-repo
git pull origin main
cd frontend
npm install
npm run build
pm2 restart nextjs-frontend
```

### View Logs
```bash
pm2 logs nextjs-frontend
tail -f /var/log/nginx/your-domain.com.access.log
```

### Restart Services
```bash
pm2 restart nextjs-frontend
systemctl restart nginx
```

### Check Status
```bash
pm2 status
systemctl status nginx
systemctl status certbot.timer
```

---

## Troubleshooting

### Site not loading?
```bash
# Check if app is running
pm2 status

# Check if nginx is running
systemctl status nginx

# Check nginx config
nginx -t
```

### SSL errors?
```bash
# Renew certificate
certbot renew

# Check certificate
openssl x509 -in /etc/ssl/certs/your-domain.com.crt -text -noout
```

### Port conflicts?
```bash
# Check what's using port 3000
netstat -tulpn | grep :3000

# Check what's using port 80/443
netstat -tulpn | grep -E ':(80|443)'
```

---

## Next Steps

1. **Setup monitoring**: Install `htop`, `iotop`
2. **Setup backups**: Automate daily backups
3. **Setup monitoring**: Use UptimeRobot or similar
4. **Setup CI/CD**: Configure GitHub Actions
5. **Setup logging**: Centralize logs with ELK stack

---

## Need Help?

Check these files:
- `NGINX_SETUP.md` - Detailed nginx configuration
- `SERVER_SETUP.md` - Complete server setup guide
- `DOCKER_DEPLOYMENT.md` - Docker deployment guide

---

**Status**: ✅ Ready for production
**Last Updated**: January 2026
