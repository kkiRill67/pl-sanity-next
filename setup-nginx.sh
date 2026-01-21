#!/bin/bash

# Nginx Setup Script for Next.js Frontend
# This script helps you configure nginx for your production server

set -e

echo "=========================================="
echo "  Nginx Setup for Next.js Frontend"
echo "=========================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "⚠️  This script requires root privileges. Please run with sudo."
    exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if nginx is installed
if ! command_exists nginx; then
    echo "📦 Installing Nginx..."
    if command_exists apt-get; then
        apt-get update
        apt-get install -y nginx
    elif command_exists yum; then
        yum install -y nginx
    elif command_exists apk; then
        apk add nginx
    else
        echo "❌ Cannot install nginx automatically. Please install it manually."
        exit 1
    fi
else
    echo "✅ Nginx is already installed"
fi

# Get domain name
echo ""
read -p "Enter your domain name (e.g., bodymetrics.ru): " DOMAIN_NAME

if [ -z "$DOMAIN_NAME" ]; then
    echo "❌ Domain name is required"
    exit 1
fi

# Create nginx config directory
mkdir -p /etc/nginx/sites-available
mkdir -p /etc/nginx/sites-enabled

# Create nginx configuration
echo ""
echo "📝 Creating nginx configuration..."

cat > /etc/nginx/sites-available/nextjs-app << EOF
# Next.js Frontend Configuration
# Generated for $DOMAIN_NAME

upstream nextjs_app {
    server 127.0.0.1:3000;
    keepalive 32;
}

# HTTP server - redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN_NAME www.$DOMAIN_NAME;

    # Security: Hide nginx version
    server_tokens off;

    # Redirect all HTTP to HTTPS
    return 301 https://\$server_name\$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $DOMAIN_NAME www.$DOMAIN_NAME;

    # SSL configuration (update these paths)
    ssl_certificate /etc/ssl/certs/$DOMAIN_NAME.crt;
    ssl_certificate_key /etc/ssl/private/$DOMAIN_NAME.key;

    # SSL security settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # OCSP Stapling (uncomment when you have SSL)
    # ssl_stapling on;
    # ssl_stapling_verify on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 256;
    gzip_comp_level 6;
    gzip_proxied any;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        text/json
        text/x-component
        application/javascript
        application/x-javascript
        application/json
        application/xml
        application/xml+rss
        application/vnd.ms-fontobject
        font/truetype
        font/otf
        font/x-woff
        image/svg+xml
        image/x-icon
        image/bmp
        image/gif
        image/jpeg
        image/jpg
        image/png
        image/webp
        application/wasm
        application/octet-stream
        audio/mpeg
        video/mp4
        video/quicktime
        video/webm;
    gzip_disable "msie6";

    # Proxy to Next.js
    location / {
        proxy_pass http://nextjs_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Host \$host;
        proxy_cache_bypass \$http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static assets with aggressive caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot|webp)$ {
        proxy_pass http://nextjs_app;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # Cache for 1 year
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header X-Content-Type-Options "nosniff";
    }

    # API routes - longer timeouts
    location /api/ {
        proxy_pass http://nextjs_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;

        # Longer timeouts for API
        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://nextjs_app/health;
        access_log off;
        allow all;
    }

    # Block access to internal paths
    location ~* ^/(studio|_next/static|_next/data|static) {
        deny all;
        return 404;
    }

    # Logging
    access_log /var/log/nginx/$DOMAIN_NAME.access.log;
    error_log /var/log/nginx/$DOMAIN_NAME.error.log;

    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone \$binary_remote_addr zone=general:10m rate=100r/s;

    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://nextjs_app;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/nextjs-app /etc/nginx/sites-enabled/

# Remove default nginx config if it exists
rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
echo ""
echo "🧪 Testing nginx configuration..."
if nginx -t; then
    echo "✅ Nginx configuration is valid"
else
    echo "❌ Nginx configuration has errors"
    exit 1
fi

# Create log directory
mkdir -p /var/log/nginx

# Enable and restart nginx
echo ""
echo "🔄 Enabling and restarting nginx..."
systemctl enable nginx
systemctl restart nginx

echo ""
echo "=========================================="
echo "  ✅ Nginx Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Get SSL certificate (Certbot or manual):"
echo "   sudo certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME"
echo ""
echo "2. Update nginx config with SSL paths:"
echo "   /etc/ssl/certs/$DOMAIN_NAME.crt"
echo "   /etc/ssl/private/$DOMAIN_NAME.key"
echo ""
echo "3. Restart nginx:"
echo "   sudo systemctl restart nginx"
echo ""
echo "4. Ensure your Next.js app is running on port 3000"
echo "   pm2 start npm --name \"nextjs\" -- start"
echo "   or"
echo "   docker-compose -f docker-compose-with-nginx.yml up -d"
echo ""
echo "5. Check nginx status:"
echo "   sudo systemctl status nginx"
echo "   sudo tail -f /var/log/nginx/$DOMAIN_NAME.access.log"
echo ""

