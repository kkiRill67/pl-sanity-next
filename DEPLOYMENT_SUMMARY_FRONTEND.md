# Frontend Deployment Summary

## ✅ What You Have Now

### 1. Docker Configuration
- **Dockerfile** - Multi-stage build for Next.js frontend only
- **docker-compose.yml** - Production compose config
- **docker-compose-with-nginx.yml** - With Nginx reverse proxy
- **build.sh** - Easy build script

### 2. GitHub Actions Workflows
- **docker-build.yml** - Build and push to GHCR
- **deploy.yml** - Deploy to VDS via SSH
- **docker-test-build.yml** - PR test builds

### 3. Nginx Configuration
- **nginx.conf** - Full production config with SSL
- **nginx-simple.conf** - Quick setup config
- **setup-nginx.sh** - Automated nginx setup script

### 4. Server Setup Scripts
- **setup-server.sh** - Complete server setup
- **setup-nginx.sh** - Nginx-only setup

### 5. Documentation
- **NGINX_SETUP.md** - Nginx configuration guide
- **SERVER_SETUP.md** - Complete server setup guide
- **QUICK_START_SERVER.md** - 5-minute setup
- **SSH_SETUP.md** - SSH configuration for deployment
- **GITHUB_SECRETS_SETUP.md** - GitHub secrets guide
- **DOCKER_DEPLOYMENT.md** - Docker deployment guide
- **DEPLOYMENT_SUMMARY.md** - Overall summary

---

## 🚀 Deployment Options

### Option 1: Manual Deployment (PM2)

**Best for**: Small projects, full control

**Steps**:
1. Setup server (run `setup-server.sh`)
2. Clone repository
3. Install dependencies: `npm install`
4. Build: `npm run build`
5. Start with PM2: `pm2 start npm --name "nextjs" -- start`
6. Setup Nginx (run `setup-nginx.sh`)
7. Get SSL: `certbot --nginx -d your-domain.com`

**Time**: ~15 minutes

---

### Option 2: Docker Deployment

**Best for**: Consistent environments, easy updates

**Steps**:
1. Setup server with Docker
2. Clone repository
3. Create `.env.local`
4. Build: `./build.sh my-app:latest`
5. Run: `docker run -d -p 3000:3000 my-app:latest`
6. Setup Nginx with Docker

**Time**: ~10 minutes

---

### Option 3: GitHub Actions CI/CD

**Best for**: Automated deployment, teams

**Steps**:
1. Setup server with SSH access
2. Add GitHub secrets (see `SSH_SETUP.md`)
3. Push to `main` branch
4. Workflow automatically:
   - Builds Docker image
   - Deploys to server
   - Restarts application

**Time**: ~20 minutes initial setup, then instant

---

## 📋 Required Environment Variables

### For Build/Deploy

```
# Sanity Configuration
SANITY_API_READ_TOKEN=your_token
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
NEXT_PUBLIC_SANITY_STUDIO_URL=https://your-project.sanity.studio

# Server Configuration (for GitHub Actions)
SSH_HOST=your-server-ip
SSH_USER=your-username
SSH_PRIVATE_KEY=your-private-key
DEPLOY_PATH=/var/www/app

# Optional: Site URL for sitemap
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

---

## 🔐 GitHub Secrets Required

### For Docker Build & Push

```
SANITY_API_READ_TOKEN
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
NEXT_PUBLIC_SANITY_API_VERSION
NEXT_PUBLIC_SANITY_STUDIO_URL
```

### For VDS Deployment

```
SANITY_API_READ_TOKEN
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
NEXT_PUBLIC_SANITY_API_VERSION
NEXT_PUBLIC_SANITY_STUDIO_URL
SSH_HOST
SSH_USER
SSH_PRIVATE_KEY
DEPLOY_PATH
```

---

## 📁 File Structure

```
project-root/
├── Dockerfile                          # Frontend-only Docker build
├── docker-compose.yml                  # Production compose
├── docker-compose-with-nginx.yml       # With Nginx
├── build.sh                            # Build script
├── build-local.sh                      # Legacy build script
├── nginx.conf                          # Full Nginx config
├── nginx-simple.conf                   # Simple Nginx config
├── setup-nginx.sh                      # Nginx setup script
├── setup-server.sh                     # Complete server setup
├── NGINX_SETUP.md                      # Nginx guide
├── SERVER_SETUP.md                     # Server guide
├── QUICK_START_SERVER.md               # Quick start
├── SSH_SETUP.md                        # SSH guide
├── GITHUB_SECRETS_SETUP.md             # Secrets guide
├── DOCKER_DEPLOYMENT.md                # Docker guide
├── DEPLOYMENT_SUMMARY.md               # Overall summary
├── DEPLOYMENT_SUMMARY_FRONTEND.md      # This file
├── .github/
│   └── workflows/
│       ├── docker-build.yml            # Build & push to GHCR
│       ├── deploy.yml                  # Deploy to VDS
│       └── docker-test-build.yml       # PR test builds
└── frontend/
    ├── package.json                    # With test scripts
    ├── next.config.ts
    ├── tsconfig.json
    ├── .env.example
    ├── .gitignore
    ├── app/
    │   ├── layout.tsx                  # SEO metadata
    │   ├── page.tsx                    # Main page
    │   ├── sitemap.ts                  # Sitemap generator
    │   ├── structured-data.ts          # Schema.org
    │   └── next-seo.config.ts          # SEO config
    ├── public/
    │   ├── robots.txt                  # SEO robots
    │   └── manifest.json               # PWA manifest
    └── sanity/
        └── lib/
            ├── queries.ts              # Sanity queries
            └── utils.ts                # Utility functions
```

---

## 🎯 Quick Start

### For Manual Deployment

```bash
# 1. Connect to server
ssh root@your-server-ip

# 2. Run setup script
git clone https://github.com/your-username/your-repo.git
cd your-repo
sudo ./setup-server.sh
# Enter domain and repo URL when prompted

# 3. Setup environment
cd frontend
cp .env.example .env.local
nano .env.local  # Fill in your values

# 4. Get SSL
certbot --nginx -d your-domain.com -d www.your-domain.com

# 5. Done! Your site is live
```

### For GitHub Actions Deployment

```bash
# 1. Setup server with SSH
# See SSH_SETUP.md

# 2. Add GitHub secrets
# See GITHUB_SECRETS_SETUP.md

# 3. Push to main
git push origin main

# 4. Watch it deploy!
```

---

## 📊 Comparison Table

| Method | Setup Time | Complexity | Automation | Best For |
|--------|------------|------------|------------|----------|
| Manual (PM2) | 15 min | Low | None | Small projects |
| Docker | 10 min | Medium | Manual | Consistent env |
| GitHub Actions | 20 min | Medium | Full | Teams, CI/CD |

---

## 🔧 Common Tasks

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
# PM2 logs
pm2 logs nextjs-frontend

# Nginx logs
tail -f /var/log/nginx/your-domain.com.access.log
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
- [ ] Use environment variables (not hardcoded secrets)
- [ ] Setup automatic backups

---

## 📈 Monitoring

### Health Checks

```bash
# Check if app is running
curl -I https://bodymetrics.ru

# Check if nginx is working
curl -I https://your-domain.com

# Check PM2 status
pm2 status

# Check Nginx status
systemctl status nginx
```

### Performance Monitoring

```bash
# Server resources
htop
df -h
free -h

# Network connections
netstat -tulpn

# Nginx active connections
sudo nginx -T | grep active
```

---

## 🆘 Troubleshooting

### Site Not Loading

1. **Check app**: `pm2 status` or `docker ps`
2. **Check nginx**: `systemctl status nginx`
3. **Check ports**: `netstat -tulpn | grep -E ':(80|443|3000)'`
4. **Check logs**: `pm2 logs` and `/var/log/nginx/`

### SSL Errors

1. **Check certificate**: `openssl x509 -in /etc/ssl/certs/your-domain.com.crt -text -noout`
2. **Renew**: `certbot renew`
3. **Test**: `certbot renew --dry-run`

### Build Errors

1. **Check environment variables**: `echo $SANITY_API_READ_TOKEN`
2. **Check Node.js version**: `node -v` (should be 20+)
3. **Clear cache**: `rm -rf node_modules .next && npm install`

---

## 📞 Support

### Documentation Files

- **NGINX_SETUP.md** - Nginx configuration details
- **SERVER_SETUP.md** - Complete server setup
- **QUICK_START_SERVER.md** - 5-minute guide
- **SSH_SETUP.md** - SSH configuration
- **GITHUB_SECRETS_SETUP.md** - GitHub secrets
- **DOCKER_DEPLOYMENT.md** - Docker deployment

### Key Commands Reference

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
6. ✅ Sanity data is loading correctly

---

## 🎉 Next Steps

1. **Setup monitoring**: UptimeRobot, New Relic, etc.
2. **Setup backups**: Automate daily backups
3. **Setup analytics**: Google Analytics, Yandex Metrika
4. **Setup error tracking**: Sentry, LogRocket
5. **Setup CI/CD**: GitHub Actions (already configured!)
6. **Setup staging**: Separate environment for testing

---

**Status**: ✅ Ready for Production Deployment
**Last Updated**: January 2026
**Version**: 1.0
