# Command Reference for Deployment

## 📋 Table of Contents

- [Setup Commands](#setup-commands)
- [Deployment Commands](#deployment-commands)
- [Management Commands](#management-commands)
- [Monitoring Commands](#monitoring-commands)
- [Troubleshooting Commands](#troubleshooting-commands)
- [Security Commands](#security-commands)
- [SSL Commands](#ssl-commands)
- [Docker Commands](#docker-commands)
- [GitHub Actions Commands](#github-actions-commands)

---

## Setup Commands

### Server Setup

```bash
# Run complete server setup
sudo ./setup-server.sh

# Run nginx setup only
sudo ./setup-nginx.sh

# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install basic tools
sudo apt-get install -y curl wget git htop iotop
```

### Node.js Setup

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Install Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# Verify installation
node -v
npm -v
```

### PM2 Setup

```bash
# Install PM2
npm install -g pm2

# Start PM2 on boot
pm2 startup
pm2 save

# Check PM2 status
pm2 status
```

### Nginx Setup

```bash
# Install Nginx
sudo apt-get install -y nginx

# Enable and start
sudo systemctl enable nginx
sudo systemctl start nginx

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Docker Setup

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### Certbot Setup

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Verify installation
certbot --version
```

---

## Deployment Commands

### Manual Deployment (PM2)

```bash
# Clone repository
git clone https://github.com/your-username/your-repo.git
cd your-repo/frontend

# Install dependencies
npm install

# Build application
npm run build

# Start with PM2
pm2 start npm --name "nextjs-frontend" -- start

# Save PM2 configuration
pm2 save
pm2 startup

# Restart application
pm2 restart nextjs-frontend

# Stop application
pm2 stop nextjs-frontend

# Delete application
pm2 delete nextjs-frontend
```

### Docker Deployment

```bash
# Build Docker image
./build.sh my-app:latest

# Run container
docker run -d --name nextjs-frontend -p 3000:3000 my-app:latest

# View container logs
docker logs -f nextjs-frontend

# Stop container
docker stop nextjs-frontend

# Remove container
docker rm nextjs-frontend

# Remove image
docker rmi my-app:latest

# Build and run with docker-compose
docker-compose -f docker-compose-with-nginx.yml up -d

# View logs
docker-compose -f docker-compose-with-nginx.yml logs -f

# Stop and remove
docker-compose -f docker-compose-with-nginx.yml down

# Rebuild and restart
docker-compose -f docker-compose-with-nginx.yml down
docker-compose -f docker-compose-with-nginx.yml up -d --build
```

### GitHub Actions Deployment

```bash
# Push to trigger deployment
git push origin main

# View workflow runs
gh run list

# View specific workflow
gh run view <run-id>

# View workflow logs
gh run view <run-id> --log

# Rerun workflow
gh run rerun <run-id>
```

---

## Management Commands

### Update Application

```bash
# Manual update
cd ~/projects/your-repo
git pull origin main
cd frontend
npm install
npm run build
pm2 restart nextjs-frontend

# Docker update
cd ~/projects/your-repo
git pull origin main
docker-compose -f docker-compose-with-nginx.yml down
docker-compose -f docker-compose-with-nginx.yml up -d --build
```

### Restart Services

```bash
# PM2
pm2 restart nextjs-frontend

# Nginx
sudo systemctl restart nginx
sudo systemctl reload nginx

# Docker
docker-compose -f docker-compose-with-nginx.yml restart

# All services
pm2 restart nextjs-frontend
sudo systemctl restart nginx
```

### Backup

```bash
# Backup PM2 configuration
pm2 save

# Backup nginx configuration
sudo tar -czf nginx-backup-$(date +%Y%m%d).tar.gz /etc/nginx/

# Backup SSL certificates
sudo tar -czf ssl-backup-$(date +%Y%m%d).tar.gz /etc/ssl/

# Backup application
tar -czf app-backup-$(date +%Y%m%d).tar.gz ~/projects/your-repo
```

### Restore

```bash
# Restore nginx configuration
sudo tar -xzf nginx-backup-20260120.tar.gz -C /

# Restore SSL certificates
sudo tar -xzf ssl-backup-20260120.tar.gz -C /

# Restore application
tar -xzf app-backup-20260120.tar.gz -C ~/
```

---

## Monitoring Commands

### Check Status

```bash
# PM2 status
pm2 status

# PM2 monit
pm2 monit

# Nginx status
systemctl status nginx

# Docker containers
docker ps

# Docker stats
docker stats
```

### View Logs

```bash
# PM2 logs
pm2 logs nextjs-frontend
pm2 logs --lines 100

# Nginx access logs
tail -f /var/log/nginx/your-domain.com.access.log
tail -f /var/log/nginx/your-domain.com.access.log -n 100

# Nginx error logs
tail -f /var/log/nginx/your-domain.com.error.log

# System logs
journalctl -u nginx -f
journalctl -u nextjs-frontend -f

# Docker logs
docker-compose -f docker-compose-with-nginx.yml logs -f
docker logs -f nextjs-frontend
```

### Check Resources

```bash
# CPU and memory
htop

# Disk usage
df -h

# Memory usage
free -h

# Network connections
netstat -tulpn

# Process list
ps aux | grep node
ps aux | grep nginx

# Port usage
netstat -tulpn | grep :3000
netstat -tulpn | grep -E ':(80|443)'
```

### Test Application

```bash
# Test local
curl -I https://bodymetrics.ru

# Test via nginx
curl -I http://your-domain.com

# Test via HTTPS
curl -I https://your-domain.com

# Test with verbose output
curl -v https://your-domain.com

# Test API endpoint
curl -I https://your-domain.com/api/health
```

---

## Troubleshooting Commands

### Application Issues

```bash
# Check if app is running
pm2 status
docker ps

# Check port usage
netstat -tulpn | grep :3000

# Check process
ps aux | grep node

# Kill process on port
sudo fuser -k 3000/tcp

# Restart application
pm2 restart nextjs-frontend

# Check logs
pm2 logs nextjs-frontend
```

### Nginx Issues

```bash
# Test configuration
sudo nginx -t

# Check status
systemctl status nginx

# Check logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Check config
sudo nginx -T

# Reload configuration
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx
```

### SSL Issues

```bash
# Check certificate
openssl x509 -in /etc/ssl/certs/your-domain.com.crt -text -noout

# Check expiration
openssl x509 -enddate -noout -in /etc/ssl/certs/your-domain.com.crt

# Renew certificate
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run

# Check certificate chain
openssl s_client -connect your-domain.com:443 -servername your-domain.com
```

### SSH Issues

```bash
# Test SSH connection
ssh -i ~/.ssh/deploy_key username@server-ip

# Test with verbose output
ssh -vvv -i ~/.ssh/deploy_key username@server-ip

# Check SSH config
cat ~/.ssh/config

# Check server SSH status
sudo systemctl status ssh

# Check SSH logs
sudo tail -f /var/log/auth.log
```

### Docker Issues

```bash
# Check Docker status
systemctl status docker

# Check Docker logs
sudo journalctl -u docker -f

# Check container logs
docker logs -f nextjs-frontend

# Check container status
docker ps -a

# Remove all stopped containers
docker container prune

# Remove unused images
docker image prune -a
```

### Build Issues

```bash
# Check Node.js version
node -v

# Check npm version
npm -v

# Clear cache
rm -rf node_modules .next
npm install
npm run build

# Check environment variables
echo $SANITY_API_READ_TOKEN
echo $NEXT_PUBLIC_SANITY_PROJECT_ID

# Check TypeScript
npx tsc --noEmit
```

---

## Security Commands

### Firewall

```bash
# Install UFW
sudo apt-get install -y ufw

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status

# Delete rule
sudo ufw delete allow 80/tcp
```

### Fail2Ban

```bash
# Install fail2ban
sudo apt-get install -y fail2ban

# Enable and start
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Check status
sudo systemctl status fail2ban

# View banned IPs
sudo fail2ban-client status sshd
```

### SSH Security

```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config

# Disable root login
PermitRootLogin no

# Disable password authentication
PasswordAuthentication no

# Restart SSH
sudo systemctl restart ssh

# Check SSH logs
sudo tail -f /var/log/auth.log
```

### File Permissions

```bash
# Fix nginx permissions
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html

# Fix SSH permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/deploy_key
```

---

## SSL Commands

### Certbot

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Renew certificate
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run

# Check certificate
sudo certbot certificates

# Delete certificate
sudo certbot delete --cert-name your-domain.com

# Force renewal
sudo certbot renew --force-renewal
```

### Manual SSL

```bash
# Generate self-signed certificate
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/your-domain.com.key \
  -out /etc/ssl/certs/your-domain.com.crt \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=your-domain.com"

# Check certificate
openssl x509 -in /etc/ssl/certs/your-domain.com.crt -text -noout

# Check expiration
openssl x509 -enddate -noout -in /etc/ssl/certs/your-domain.com.crt
```

---

## Docker Commands

### Basic Commands

```bash
# Build image
docker build -t my-app:latest .

# Run container
docker run -d --name my-app -p 3000:3000 my-app:latest

# View logs
docker logs -f my-app

# Stop container
docker stop my-app

# Remove container
docker rm my-app

# Remove image
docker rmi my-app:latest

# List containers
docker ps
docker ps -a

# List images
docker images

# System prune
docker system prune -a
```

### Docker Compose

```bash
# Build and run
docker-compose -f docker-compose-with-nginx.yml up -d

# View logs
docker-compose -f docker-compose-with-nginx.yml logs -f

# Stop and remove
docker-compose -f docker-compose-with-nginx.yml down

# Rebuild
docker-compose -f docker-compose-with-nginx.yml build --no-cache

# Restart
docker-compose -f docker-compose-with-nginx.yml restart

# Check status
docker-compose -f docker-compose-with-nginx.yml ps
```

---

## GitHub Actions Commands

### CLI Commands

```bash
# Install GitHub CLI
# https://cli.github.com/

# View workflow runs
gh run list

# View specific run
gh run view <run-id>

# View logs
gh run view <run-id> --log

# Rerun workflow
gh run rerun <run-id>

# Cancel workflow
gh run cancel <run-id>

# View secrets
gh secret list

# Set secret
gh secret set SECRET_NAME --body "value"

# Delete secret
gh secret delete SECRET_NAME
```

### Manual Trigger

```bash
# Trigger workflow manually
gh workflow run deploy.yml

# Trigger with ref
gh workflow run deploy.yml --ref main
```

---

## Quick Reference

### Most Used Commands

```bash
# Setup
sudo ./setup-server.sh

# Deploy
git push origin main

# Update
cd ~/projects/your-repo && git pull && cd frontend && npm install && npm run build && pm2 restart nextjs-frontend

# Check status
pm2 status && systemctl status nginx

# View logs
pm2 logs nextjs-frontend

# Test site
curl -I https://your-domain.com

# Renew SSL
sudo certbot renew
```

### Emergency Commands

```bash
# Restart everything
pm2 restart nextjs-frontend
sudo systemctl restart nginx

# Check disk space
df -h

# Check memory
free -h

# Kill stuck process
sudo fuser -k 3000/tcp

# Force restart
sudo reboot
```

---

## Environment Variables

### Set Variables

```bash
# Temporary (current session)
export SANITY_API_READ_TOKEN=your_token

# Permanent (add to ~/.bashrc)
echo 'export SANITY_API_READ_TOKEN=your_token' >> ~/.bashrc
source ~/.bashrc

# In .env.local file
SANITY_API_READ_TOKEN=your_token
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
```

### Check Variables

```bash
# Check specific variable
echo $SANITY_API_READ_TOKEN

# Check all environment variables
env

# Check Node.js environment
node -e "console.log(process.env)"
```

---

## Performance Commands

### PM2 Cluster

```bash
# Start with cluster mode
pm2 start npm --name "nextjs-frontend" -- start -i max

# Or use ecosystem file
pm2 start ecosystem.config.js
```

### Nginx Optimization

```bash
# Check nginx config
sudo nginx -T

# Test performance
ab -n 1000 -c 10 https://your-domain.com/

# Monitor connections
sudo nginx -T | grep active
```

### System Optimization

```bash
# Clear cache
sync && echo 3 | sudo tee /proc/sys/vm/drop_caches

# Check load average
uptime

# Check top processes
top -o %CPU
top -o %MEM
```

---

## Maintenance Commands

### Daily

```bash
# Check logs
pm2 logs --lines 50
tail -f /var/log/nginx/your-domain.com.access.log

# Check status
pm2 status
systemctl status nginx

# Check disk space
df -h
```

### Weekly

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Clean up
sudo apt-get autoremove -y
sudo apt-get autoclean

# Check SSL expiration
sudo certbot certificates
```

### Monthly

```bash
# Backup
tar -czf backup-$(date +%Y%m%d).tar.gz ~/projects/your-repo

# Update dependencies
cd ~/projects/your-repo/frontend
npm update
npm audit fix

# Review logs
sudo grep "error" /var/log/nginx/error.log
```

---

## Summary

### Essential Commands

| Task | Command |
|------|---------|
| Setup | `sudo ./setup-server.sh` |
| Deploy | `git push origin main` |
| Update | `git pull && npm install && npm run build && pm2 restart` |
| Check status | `pm2 status && systemctl status nginx` |
| View logs | `pm2 logs` |
| Test site | `curl -I https://your-domain.com` |
| Renew SSL | `sudo certbot renew` |

### Emergency Commands

| Issue | Command |
|-------|---------|
| App not running | `pm2 restart nextjs-frontend` |
| Nginx not running | `sudo systemctl restart nginx` |
| Port conflict | `sudo fuser -k 3000/tcp` |
| Disk full | `df -h` and clean up |
| Memory full | `free -h` and restart services |

---

**Last Updated**: January 2026
**Version**: 1.0
