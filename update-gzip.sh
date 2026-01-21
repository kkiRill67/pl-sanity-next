#!/bin/bash

# Auto-update Nginx configuration with optimized Gzip settings
# This script safely updates your Nginx configuration with improved gzip compression

set -e

echo "=========================================="
echo "  Nginx Gzip Optimization Update"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}⚠️  This script requires root privileges. Please run with sudo.${NC}"
    exit 1
fi

# Check if domain is provided
if [ -z "$1" ]; then
    echo "Usage: sudo ./update-gzip.sh <your-domain.com>"
    echo "Example: sudo ./update-gzip.sh example.com"
    echo ""
    echo "Available configs:"
    echo "  1. nginx-optimized.conf (recommended) - Full featured with advanced gzip"
    echo "  2. nginx.conf - Standard configuration with gzip"
    echo "  3. nginx-simple.conf - Basic configuration with gzip"
    exit 1
fi

DOMAIN=$1
CONFIG_FILE=""

# Ask which config to use
echo "Select configuration:"
echo "  1) nginx-optimized.conf (recommended)"
echo "  2) nginx.conf (standard)"
echo "  3) nginx-simple.conf (basic)"
echo -n "Choice [1-3] (default: 1): "
read choice

case $choice in
    2)
        CONFIG_FILE="nginx.conf"
        ;;
    3)
        CONFIG_FILE="nginx-simple.conf"
        ;;
    *)
        CONFIG_FILE="nginx-optimized.conf"
        ;;
esac

echo ""
echo -e "${GREEN}✓ Selected: $CONFIG_FILE${NC}"
echo ""

# Create backup
BACKUP_DIR="/etc/nginx/backups"
mkdir -p "$BACKUP_DIR"
BACKUP_FILE="$BACKUP_DIR/default.conf.backup.$(date +%Y%m%d_%H%M%S)"

echo "📁 Creating backup..."
if [ -f "/etc/nginx/conf.d/default.conf" ]; then
    cp "/etc/nginx/conf.d/default.conf" "$BACKUP_FILE"
    echo -e "${GREEN}✓ Backup created: $BACKUP_FILE${NC}"
else
    echo -e "${YELLOW}⚠️  No existing config found. Creating new one.${NC}"
fi

echo ""
echo "📝 Updating configuration..."

# Copy selected config
if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${RED}❌ Config file $CONFIG_FILE not found!${NC}"
    exit 1
fi

sudo cp "$CONFIG_FILE" "/etc/nginx/conf.d/default.conf"

# Replace domain placeholder
echo "🔧 Replacing domain..."

# Use sed to replace all occurrences
sudo sed -i.bak "s/your-domain\.com/$DOMAIN/g" "/etc/nginx/conf.d/default.conf"
sudo sed -i.bak "s/www\.your-domain\.com/www\.$DOMAIN/g" "/etc/nginx/conf.d/default.conf"

# Remove .bak file
rm -f "/etc/nginx/conf.d/default.conf.bak"

echo -e "${GREEN}✓ Domain replaced: $DOMAIN${NC}"

# Test configuration
echo ""
echo "🧪 Testing configuration..."

if sudo nginx -t; then
    echo -e "${GREEN}✓ Configuration is valid${NC}"
else
    echo -e "${RED}❌ Configuration has errors${NC}"
    echo ""
    echo "Restoring backup..."
    if [ -f "$BACKUP_FILE" ]; then
        cp "$BACKUP_FILE" "/etc/nginx/conf.d/default.conf"
        echo -e "${GREEN}✓ Backup restored${NC}"
    fi
    exit 1
fi

# Reload Nginx
echo ""
echo "🔄 Reloading Nginx..."

if sudo systemctl reload nginx; then
    echo -e "${GREEN}✓ Nginx reloaded successfully${NC}"
else
    echo -e "${YELLOW}⚠️  Nginx reload failed, trying restart...${NC}"
    if sudo systemctl restart nginx; then
        echo -e "${GREEN}✓ Nginx restarted successfully${NC}"
    else
        echo -e "${RED}❌ Nginx failed to restart${NC}"
        exit 1
    fi
fi

# Test gzip
echo ""
echo "🔍 Testing gzip compression..."

# Wait a moment for Nginx to fully reload
sleep 2

# Test with curl
if command -v curl &> /dev/null; then
    response=$(curl -s -I -H "Accept-Encoding: gzip" "http://$DOMAIN" 2>/dev/null || echo "error")
    
    if echo "$response" | grep -q "Location"; then
        echo -e "${GREEN}✓ HTTP redirect is working${NC}"
        
        # Test HTTPS if configured
        response_https=$(curl -s -I -H "Accept-Encoding: gzip" "https://$DOMAIN" 2>/dev/null || echo "error")
        
        if echo "$response_https" | grep -qi "Content-Encoding: gzip"; then
            echo -e "${GREEN}✓ Gzip compression is ACTIVE on HTTPS${NC}"
        elif echo "$response_https" | grep -q "error"; then
            echo -e "${YELLOW}⚠️  HTTPS not responding (may not be configured)${NC}"
        else
            echo -e "${YELLOW}⚠️  Gzip not detected on HTTPS${NC}"
            echo -e "${YELLOW}  (This might be due to SSL configuration)${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Could not test gzip (domain may not be accessible)${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  curl not available, skipping gzip test${NC}"
fi

# Display configuration summary
echo ""
echo "=========================================="
echo -e "${GREEN}✅ Update Complete!${NC}"
echo "=========================================="
echo ""
echo "Configuration:"
echo "  • Domain: $DOMAIN"
echo "  • Config: $CONFIG_FILE"
echo "  • Backup: $BACKUP_FILE"
echo ""
echo "Gzip Settings:"
echo "  • Minimum length: 256 bytes"
echo "  • Compression level: 6 (optimal)"
echo "  • Proxy support: enabled"
echo "  • Types: 30+ file types"
echo ""
echo "Next steps:"
echo "1. Test your site: https://$DOMAIN"
echo "2. Run detailed test: ./test-gzip.sh $DOMAIN"
echo "3. Check logs: sudo tail -f /var/log/nginx/$DOMAIN.access.log"
echo ""
echo "To revert changes:"
echo "  sudo cp $BACKUP_FILE /etc/nginx/conf.d/default.conf"
echo "  sudo systemctl reload nginx"
echo ""
echo "For more details, see: GZIP_SETUP.md"
echo ""
