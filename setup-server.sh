#!/bin/bash

# Quick Server Setup Script for Next.js Frontend
# This script sets up everything needed to deploy your Next.js app

set -e

echo "=========================================="
echo "  Next.js Frontend Server Setup"
echo "=========================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "⚠️  This script requires root privileges. Please run with sudo."
    exit 1
fi

# Get domain name
read -p "Enter your domain name (e.g., bodymetrics.ru): " DOMAIN_NAME

if [ -z "$DOMAIN_NAME" ]; then
    echo "❌ Domain name is required"
    exit 1
fi

# Get repository URL
read -p "Enter your repository URL (e.g., https://github.com/username/repo.git): " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ Repository URL is required"
    exit 1
fi

# Get project directory
read -p "Enter project directory name (default: my-app): " PROJECT_DIR
PROJECT_DIR=${PROJECT_DIR:-my-app}

echo ""
echo "=========================================="
echo "  Starting Setup..."
echo "=========================================="
echo ""

# Update system
echo "📦 Updating system..."
apt-get update
apt-get upgrade -y

# Install basic tools
echo "🔧 Installing basic tools..."
apt-get install -y curl wget git htop iotop

# Install Nginx
echo "🔧 Installing Nginx..."
apt-get install -y nginx
systemctl enable nginx
systemctl start nginx

# Install Certbot
echo "🔧 Installing Certbot..."
apt-get install -y certbot python3-certbot-nginx

# Install NVM and Node.js
echo "🔧 Installing Node.js..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
nvm alias default 20

# Install PM2
echo "🔧 Installing PM2..."
npm install -g pm2

# Setup firewall
echo "🔥 Configuring firewall..."
apt-get install -y ufw
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Create project directory
echo "📁 Creating project directory..."
mkdir -p /root/projects
cd /root/projects

# Clone repository
echo "📥 Cloning repository..."
git clone "$REPO_URL" "$PROJECT_DIR"
cd "$PROJECT_DIR"

# Setup nginx
echo "⚙️  Setting up Nginx..."
./setup-nginx.sh <<< "$DOMAIN_NAME"

# Setup frontend
echo "⚙️  Setting up frontend..."
cd frontend
npm install
npm run build

# Start with PM2
echo "🚀 Starting application with PM2..."
pm2 start npm --name "nextjs-frontend" -- start
pm2 save
pm2 startup

echo ""
echo "=========================================="
echo "  ✅ Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Get SSL certificate:"
echo "   certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME"
echo ""
echo "2. Setup environment variables:"
echo "   cd /root/projects/$PROJECT_DIR/frontend"
echo "   nano .env.local"
echo ""
echo "3. Restart application:"
echo "   pm2 restart nextjs-frontend"
echo ""
echo "4. Check status:"
echo "   pm2 status"
echo "   systemctl status nginx"
echo ""
echo "5. View logs:"
echo "   pm2 logs nextjs-frontend"
echo "   tail -f /var/log/nginx/$DOMAIN_NAME.access.log"
echo ""
echo "Your site should be live at http://$DOMAIN_NAME"
echo "After SSL setup: https://$DOMAIN_NAME"
echo ""
