# Server Setup Guide for Next.js Frontend

This guide explains how to set up a production server for your Next.js frontend application.

## Prerequisites

- VPS or dedicated server (Ubuntu 20.04/22.04 recommended)
- Root or sudo access
- Domain name (optional but recommended)
- At least 2GB RAM, 20GB storage

## Server Setup (Step-by-Step)

### 1. Initial Server Setup

#### Update System

```bash
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install -y curl wget git htop iotop
```

#### Create Non-Root User (Recommended)

```bash
# Create new user
adduser yourusername

# Add to sudo group
usermod -aG sudo yourusername

# Switch to new user
su - yourusername

# Setup SSH key (optional but recommended)
mkdir -p ~/.ssh
chmod 700 ~/.ssh
# Add your public key to ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

#### Configure Firewall

```bash
# Install UFW
sudo apt-get install -y ufw

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### 2. Install Node.js

#### Option 1: Using Node Version Manager (NVM) - Recommended

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell
source ~/.bashrc

# Install Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# Verify installation
node -v
npm -v
```

#### Option 2: Using NodeSource Repository

```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt-get install -y nodejs

# Verify installation
node -v
npm -v
```

### 3. Install PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start PM2 on boot
pm2 startup
# Follow the instructions to run the generated command

# Save PM2 process list
pm2 save
```

### 4. Install Nginx

```bash
sudo apt-get install -y nginx

# Enable Nginx on boot
sudo systemctl enable nginx

# Start Nginx
sudo systemctl start nginx

# Check status
sudo systemctl status nginx
```

### 5. Install Docker (Optional)

If you want to use Docker deployment:

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group (optional)
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### 6. Install Certbot (SSL Certificates)

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Verify installation
certbot --version
```

## Deploy Your Application

### Option 1: Manual Deployment (Git + PM2)

#### Clone Repository

```bash
# Create project directory
mkdir -p ~/projects
cd ~/projects

# Clone your repository
git clone https://github.com/your-username/your-repo.git
cd your-repo/frontend
```

#### Install Dependencies

```bash
npm install
```

#### Build Application

```bash
npm run build
```

#### Start with PM2

```bash
# Start application
pm2 start npm --name "nextjs-frontend" -- start

# Or with specific port
PORT=3000 pm2 start npm --name "nextjs-frontend" -- start

# Save PM2 configuration
pm2 save
pm2 startup

# Check logs
pm2 logs nextjs-frontend

# Check status
pm2 status
```

#### Configure PM2 Ecosystem (Optional)

Create `ecosystem.config.js` in your project root:

```javascript
module.exports = {
  apps: [{
    name: 'nextjs-frontend',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    instances: 'max',
    exec_mode: 'cluster',
    max_memory_restart: '1G',
    watch: false,
    max_restarts: 10,
    min_uptime: '10s',
  }]
}
```

Start with ecosystem:

```bash
pm2 start ecosystem.config.js
pm2 save
```

### Option 2: Docker Deployment

#### Clone Repository

```bash
mkdir -p ~/projects
cd ~/projects
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

#### Setup Environment Variables

```bash
cp .env.example .env.local
# Edit .env.local with your actual values
nano .env.local
```

#### Build and Run with Docker

```bash
# Build and run with docker-compose
docker-compose -f docker-compose-with-nginx.yml up -d

# Or build manually
./build.sh my-app:latest
docker run -d --name nextjs-frontend -p 3000:3000 my-app:latest
```

#### Setup Nginx with Docker

```bash
# Create SSL directory
mkdir -p ssl

# Place SSL certificates in ssl/ directory
# ssl/your-domain.com.crt
# ssl/your-domain.com.key

# Update nginx.conf with correct paths

# Run with nginx
docker-compose -f docker-compose-with-nginx.yml up -d

# View logs
docker-compose -f docker-compose-with-nginx.yml logs -f
```

### Option 3: GitHub Actions CI/CD

#### Setup GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions:

Required secrets:
- `SSH_HOST` - Your server IP/domain
- `SSH_USER` - SSH username
- `SSH_PRIVATE_KEY` - SSH private key
- `DEPLOY_PATH` - Deployment directory (e.g., `/home/yourusername/projects/your-repo`)
- `SANITY_API_READ_TOKEN` - Sanity API token
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` - Sanity dataset (usually "production")
- `NEXT_PUBLIC_SANITY_API_VERSION` - Sanity API version (e.g., "2025-01-01")
- `NEXT_PUBLIC_SANITY_STUDIO_URL` - Sanity Studio URL

#### Generate SSH Key

```bash
# Generate SSH key pair
ssh-keygen -t ed25519 -C "deploy@your-server" -f ~/.ssh/deploy_key

# Add public key to server
ssh-copy-id -i ~/.ssh/deploy_key.pub yourusername@your-server-ip

# Test connection
ssh -i ~/.ssh/deploy_key yourusername@your-server-ip
```

#### Add to GitHub Secrets

Copy the private key:
```bash
cat ~/.ssh/deploy_key
```

Paste it into GitHub secret `SSH_PRIVATE_KEY`.

#### Deploy Workflow

The `.github/workflows/deploy.yml` will automatically:
1. Build Docker image
2. Save image to file
3. Transfer to server via SSH
4. Load and run Docker container on server

## Nginx Configuration

### Quick Setup

```bash
# Run the setup script
sudo ./setup-nginx.sh
```

### Manual Setup

See `NGINX_SETUP.md` for detailed nginx configuration.

## SSL Certificate Setup

### Using Let's Encrypt (Recommended)

```bash
# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test renewal
sudo certbot renew --dry-run

# Auto-renewal is enabled by default
```

### Using Self-Signed (For Testing)

```bash
# Generate self-signed certificate
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/your-domain.com.key \
  -out /etc/ssl/certs/your-domain.com.crt \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=your-domain.com"
```

## Monitoring & Maintenance

### Monitor Application

```bash
# PM2 status
pm2 status

# PM2 logs
pm2 logs nextjs-frontend

# PM2 monit
pm2 monit

# System resources
htop
iotop
df -h
free -h
```

### Monitor Nginx

```bash
# Nginx status
sudo systemctl status nginx

# Nginx logs
sudo tail -f /var/log/nginx/your-domain.com.access.log
sudo tail -f /var/log/nginx/your-domain.com.error.log

# Active connections
sudo nginx -T | grep active
```

### Update Application

```bash
# Pull latest changes
cd ~/projects/your-repo
git pull origin main

# Install dependencies
cd frontend
npm install

# Build
npm run build

# Restart PM2
pm2 restart nextjs-frontend

# Or with Docker
docker-compose -f docker-compose-with-nginx.yml down
docker-compose -f docker-compose-with-nginx.yml up -d --build
```

### Backup

```bash
# Backup PM2 configuration
pm2 save

# Backup nginx configuration
sudo tar -czf nginx-backup-$(date +%Y%m%d).tar.gz /etc/nginx/

# Backup SSL certificates
sudo tar -czf ssl-backup-$(date +%Y%m%d).tar.gz /etc/ssl/

# Backup application data
tar -czf app-backup-$(date +%Y%m%d).tar.gz ~/projects/your-repo
```

## Security Checklist

- [ ] Use non-root user for deployment
- [ ] Setup SSH key authentication (disable password login)
- [ ] Configure firewall (UFW)
- [ ] Install fail2ban for brute force protection
- [ ] Use SSL certificates (HTTPS)
- [ ] Keep system updated
- [ ] Monitor logs regularly
- [ ] Setup automatic backups
- [ ] Use strong passwords
- [ ] Disable unnecessary services

## Troubleshooting

### Application Not Starting

```bash
# Check PM2 status
pm2 status

# Check PM2 logs
pm2 logs

# Check port usage
sudo netstat -tulpn | grep :3000

# Check if Node.js is running
ps aux | grep node
```

### Nginx Errors

```bash
# Test nginx configuration
sudo nginx -t

# Check nginx logs
sudo tail -f /var/log/nginx/error.log

# Check nginx status
sudo systemctl status nginx
```

### SSL Certificate Issues

```bash
# Check certificate
sudo openssl x509 -in /etc/ssl/certs/your-domain.com.crt -text -noout

# Check certificate expiration
sudo openssl x509 -enddate -noout -in /etc/ssl/certs/your-domain.com.crt

# Renew certificate
sudo certbot renew
```

### Memory Issues

```bash
# Check memory usage
free -h

# Check disk usage
df -h

# Check running processes
top

# Restart application
pm2 restart nextjs-frontend
```

## Performance Optimization

### PM2 Cluster Mode

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'nextjs-frontend',
    script: 'npm',
    args: 'start',
    instances: 'max',  // Use all CPU cores
    exec_mode: 'cluster',
    max_memory_restart: '1G',
  }]
}
```

### Nginx Caching

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Gzip Compression

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
```

## Common Commands

### PM2 Commands

```bash
pm2 start npm --name "app" -- start
pm2 stop app
pm2 restart app
pm2 delete app
pm2 logs app
pm2 status
pm2 monit
pm2 save
pm2 startup
```

### Nginx Commands

```bash
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl reload nginx
sudo systemctl status nginx
sudo nginx -t
```

### Docker Commands

```bash
docker-compose -f docker-compose-with-nginx.yml up -d
docker-compose -f docker-compose-with-nginx.yml down
docker-compose -f docker-compose-with-nginx.yml logs -f
docker-compose -f docker-compose-with-nginx.yml build --no-cache
```

### System Commands

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Check disk space
df -h

# Check memory
free -h

# Check running processes
ps aux | grep node
ps aux | grep nginx

# Kill process on port
sudo fuser -k 3000/tcp
```

## Resources

- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/process-management/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Ubuntu Server Guide](https://ubuntu.com/server/docs)

## Support

If you encounter issues:

1. Check application logs: `pm2 logs`
2. Check nginx logs: `/var/log/nginx/`
3. Check system resources: `htop`, `df -h`, `free -h`
4. Test configuration: `sudo nginx -t`
5. Verify ports: `sudo netstat -tulpn`

---

**Last Updated**: January 2026
**Version**: 1.0
