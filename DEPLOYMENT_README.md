# Deployment Guide for Next.js Frontend

## 🚀 Quick Start (5 Minutes)

### Option 1: Manual Deployment (Recommended for Beginners)

```bash
# 1. Connect to your server
ssh root@your-server-ip

# 2. Clone your repository
git clone https://github.com/your-username/your-repo.git
cd your-repo

# 3. Run the setup script
sudo ./setup-server.sh
# Enter your domain name and repository URL when prompted

# 4. Setup environment variables
cd frontend
cp .env.example .env.local
nano .env.local  # Fill in your values

# 5. Get SSL certificate
certbot --nginx -d your-domain.com -d www.your-domain.com

# Done! Your site is live at https://your-domain.com
```

### Option 2: GitHub Actions CI/CD (Recommended for Teams)

```bash
# 1. Setup server with SSH access
# See SSH_SETUP.md

# 2. Add GitHub secrets
# See GITHUB_SECRETS_SETUP.md

# 3. Push to main branch
git push origin main

# 4. Watch it deploy automatically!
```

---

## 📚 Documentation

### Essential Guides

| Guide | When to Use |
|-------|-------------|
| **QUICK_START_SERVER.md** | First time setup |
| **SSH_SETUP.md** | Setting up SSH for CI/CD |
| **GITHUB_SECRETS_SETUP.md** | Configuring GitHub secrets |
| **NGINX_SETUP.md** | Nginx configuration details |
| **SERVER_SETUP.md** | Complete server setup |
| **DOCKER_DEPLOYMENT.md** | Docker deployment |
| **DEPLOYMENT_SUMMARY_FRONTEND.md** | Overview of all options |

### Scripts

| Script | Purpose |
|--------|---------|
| **setup-server.sh** | Complete server setup (recommended) |
| **setup-nginx.sh** | Nginx-only setup |
| **build.sh** | Docker build script |

### Configuration Files

| File | Purpose |
|------|---------|
| **nginx.conf** | Full Nginx config with SSL |
| **nginx-simple.conf** | Simple Nginx config |
| **docker-compose-with-nginx.yml** | Docker + Nginx setup |
| **.github/workflows/deploy.yml** | GitHub Actions deployment |

---

## 🎯 Choose Your Path

### Path 1: Manual Deployment (PM2 + Nginx)

**Best for**: Small projects, learning, full control

**Time**: ~15 minutes

**Steps**:
1. Run `setup-server.sh`
2. Setup environment variables
3. Get SSL certificate
4. Done!

**Pros**:
- ✅ Full control
- ✅ Easy to understand
- ✅ No external dependencies

**Cons**:
- ❌ Manual updates
- ❌ No CI/CD

---

### Path 2: Docker Deployment

**Best for**: Consistent environments, easy updates

**Time**: ~10 minutes

**Steps**:
1. Install Docker
2. Build image: `./build.sh my-app:latest`
3. Run container
4. Setup Nginx

**Pros**:
- ✅ Consistent environment
- ✅ Easy rollback
- ✅ Portable

**Cons**:
- ❌ Requires Docker knowledge
- ❌ More complex setup

---

### Path 3: GitHub Actions CI/CD

**Best for**: Teams, automated deployment

**Time**: ~20 minutes initial setup

**Steps**:
1. Setup server with SSH
2. Add GitHub secrets
3. Push to main
4. Automatic deployment

**Pros**:
- ✅ Fully automated
- ✅ Consistent deployment
- ✅ Team-friendly

**Cons**:
- ❌ Requires GitHub
- ❌ More setup initially

---

## 🔐 Required Secrets

### For All Deployments

```
SANITY_API_READ_TOKEN=your_token
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
NEXT_PUBLIC_SANITY_STUDIO_URL=https://your-project.sanity.studio
```

### For GitHub Actions Only

```
SSH_HOST=your-server-ip
SSH_USER=your-username
SSH_PRIVATE_KEY=your-private-key
DEPLOY_PATH=/var/www/app
```

---

## 📋 Checklist

### Before Deployment

- [ ] Domain name points to server IP
- [ ] Server has at least 2GB RAM
- [ ] Server has at least 20GB storage
- [ ] Node.js 20+ installed
- [ ] Nginx installed
- [ ] Environment variables configured
- [ ] SSL certificate ready (or will use Certbot)

### After Deployment

- [ ] Site loads in browser
- [ ] SSL certificate is valid
- [ ] Sanity data loads correctly
- [ ] No errors in console
- [ ] Mobile responsive
- [ ] SEO metadata present

---

## 🛠️ Common Tasks

### Update Application

**Manual**:
```bash
cd ~/projects/your-repo
git pull origin main
cd frontend
npm install
npm run build
pm2 restart nextjs-frontend
```

**Docker**:
```bash
cd ~/projects/your-repo
git pull origin main
docker-compose -f docker-compose-with-nginx.yml down
docker-compose -f docker-compose-with-nginx.yml up -d --build
```

**GitHub Actions**:
```bash
git push origin main
# Workflow handles everything
```

### View Logs

```bash
# Application logs
pm2 logs nextjs-frontend

# Nginx access logs
tail -f /var/log/nginx/your-domain.com.access.log

# Nginx error logs
tail -f /var/log/nginx/your-domain.com.error.log

# Docker logs
docker-compose -f docker-compose-with-nginx.yml logs -f
```

### Restart Services

```bash
# PM2
pm2 restart nextjs-frontend

# Nginx
sudo systemctl restart nginx

# Docker
docker-compose -f docker-compose-with-nginx.yml restart
```

### Check Status

```bash
# PM2 status
pm2 status

# Nginx status
systemctl status nginx

# Docker containers
docker ps

# SSL certificate
openssl x509 -in /etc/ssl/certs/your-domain.com.crt -text -noout
```

---

## 🆘 Troubleshooting

### Site Not Loading

1. **Check if app is running**:
   ```bash
   pm2 status
   # or
   docker ps
   ```

2. **Check if nginx is running**:
   ```bash
   systemctl status nginx
   ```

3. **Check ports**:
   ```bash
   netstat -tulpn | grep -E ':(80|443|3000)'
   ```

4. **Check logs**:
   ```bash
   pm2 logs
   tail -f /var/log/nginx/error.log
   ```

### SSL Certificate Issues

1. **Check certificate**:
   ```bash
   openssl x509 -in /etc/ssl/certs/your-domain.com.crt -text -noout
   ```

2. **Renew certificate**:
   ```bash
   certbot renew
   ```

3. **Test renewal**:
   ```bash
   certbot renew --dry-run
   ```

### Build Errors

1. **Check environment variables**:
   ```bash
   echo $SANITY_API_READ_TOKEN
   ```

2. **Check Node.js version**:
   ```bash
   node -v  # Should be 20+
   ```

3. **Clear cache**:
   ```bash
   rm -rf node_modules .next
   npm install
   npm run build
   ```

### SSH Connection Issues

1. **Test SSH**:
   ```bash
   ssh -i ~/.ssh/deploy_key username@server-ip
   ```

2. **Check SSH config**:
   ```bash
   cat ~/.ssh/config
   ```

3. **Check server SSH**:
   ```bash
   sudo systemctl status ssh
   ```

---

## 📊 Performance Tips

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
gzip_types text/plain text/css text/xml text/javascript application/json;
```

---

## 🛡️ Security Checklist

- [ ] Use non-root user for deployment
- [ ] Setup SSH key authentication
- [ ] Disable password authentication
- [ ] Configure firewall (UFW)
- [ ] Install SSL certificate
- [ ] Setup fail2ban
- [ ] Monitor logs regularly
- [ ] Keep system updated
- [ ] Use environment variables
- [ ] Setup automatic backups

---

## 📞 Support

### Documentation Files

- **QUICK_START_SERVER.md** - 5-minute setup guide
- **SSH_SETUP.md** - SSH configuration
- **GITHUB_SECRETS_SETUP.md** - GitHub secrets
- **NGINX_SETUP.md** - Nginx details
- **SERVER_SETUP.md** - Complete server setup
- **DOCKER_DEPLOYMENT.md** - Docker deployment
- **DEPLOYMENT_SUMMARY_FRONTEND.md** - Overview

### Key Commands

```bash
# Setup
sudo ./setup-server.sh
sudo ./setup-nginx.sh

# Deploy
./build.sh my-app:latest
docker run -d -p 3000:3000 my-app:latest

# Manage
pm2 status
pm2 logs
systemctl restart nginx

# Monitor
tail -f /var/log/nginx/your-domain.com.access.log
curl -I https://your-domain.com
```

---

## ✅ Success Criteria

Your deployment is successful when:

1. ✅ `curl -I https://your-domain.com` returns `200 OK`
2. ✅ `pm2 status` shows app is running
3. ✅ `systemctl status nginx` shows nginx is active
4. ✅ SSL certificate is valid
5. ✅ Site loads in browser without errors
6. ✅ Sanity data loads correctly
7. ✅ SEO metadata is present
8. ✅ Mobile responsive

---

## 🎉 Next Steps

1. **Setup monitoring**: UptimeRobot, New Relic, etc.
2. **Setup backups**: Automate daily backups
3. **Setup analytics**: Google Analytics, Yandex Metrika
4. **Setup error tracking**: Sentry, LogRocket
5. **Setup staging**: Separate environment for testing
6. **Setup CI/CD**: GitHub Actions (already configured!)

---

## 📚 Additional Resources

- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/process-management/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions](https://docs.github.com/en/actions)

---

## 🚀 Ready to Deploy?

Choose your path:

1. **Quick Start**: Run `sudo ./setup-server.sh`
2. **Manual**: Follow `QUICK_START_SERVER.md`
3. **CI/CD**: Follow `SSH_SETUP.md` + `GITHUB_SECRETS_SETUP.md`

---

**Status**: ✅ Ready for Production
**Last Updated**: January 2026
**Version**: 1.0
