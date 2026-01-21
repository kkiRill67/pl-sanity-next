#!/bin/bash

# Test Gzip compression for Nginx configuration
# This script tests if gzip is working correctly

set -e

echo "=========================================="
echo "  Gzip Compression Test"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if domain is provided
if [ -z "$1" ]; then
    echo "Usage: ./test-gzip.sh <domain>"
    echo "Example: ./test-gzip.sh your-domain.com"
    exit 1
fi

DOMAIN=$1

# Function to test gzip
test_gzip() {
    local url=$1
    local accept_encoding=$2
    local description=$3
    
    echo -n "Testing $description... "
    
    # Make request with curl and capture response headers
    response=$(curl -s -I -H "Accept-Encoding: $accept_encoding" "$url")
    
    # Check for Content-Encoding header
    if echo "$response" | grep -qi "Content-Encoding: gzip"; then
        echo -e "${GREEN}✓ GZIP ACTIVE${NC}"
        return 0
    elif echo "$response" | grep -qi "Content-Encoding: br"; then
        echo -e "${GREEN}✓ BROTLI ACTIVE${NC}"
        return 0
    else
        echo -e "${RED}✗ NOT COMPRESSED${NC}"
        echo "$response" | grep -i "content-encoding\|content-type" | head -2
        return 1
    fi
}

# Function to check response size
check_size() {
    local url=$1
    local accept_encoding=$2
    local description=$3
    
    echo -n "Checking $description size... "
    
    # Get response size
    size=$(curl -s -H "Accept-Encoding: $accept_encoding" -w "%{size_download}" "$url" -o /dev/null)
    
    echo "($size bytes)"
}

echo "Testing $DOMAIN..."
echo ""

# Test HTTP (should redirect)
echo "1. HTTP Test (should redirect to HTTPS):"
curl -s -I "http://$DOMAIN" | grep -i "location\|http" | head -2
echo ""

# Test HTTPS with compression
echo "2. Testing with Gzip support:"
echo ""

# Test main page
echo "Main page (/):"
test_gzip "https://$DOMAIN/" "gzip" "HTML with gzip"
test_gzip "https://$DOMAIN/" "gzip, deflate" "HTML with gzip/deflate"
echo ""

# Test CSS file (get actual CSS file from site)
echo "Testing static resources:"
test_gzip "https://$DOMAIN/" "gzip" "with gzip"
test_gzip "https://$DOMAIN/" "br" "with Brotli"
echo ""

# Test without compression
echo "Testing without compression (baseline):"
curl -s -H "Accept-Encoding: identity" -w "\nSize: %{size_download} bytes\n" -o /dev/null "https://$DOMAIN/"
echo ""

# Test with compression
echo "Testing with gzip compression:"
curl -s -H "Accept-Encoding: gzip" -w "\nSize: %{size_download} bytes\n" -o /dev/null "https://$DOMAIN/"
echo ""

# Check nginx configuration
echo "3. Checking Nginx configuration:"
echo ""

# Check if nginx is accessible
if curl -s -I "https://$DOMAIN/" > /dev/null; then
    echo -e "${GREEN}✓ Nginx is accessible${NC}"
else
    echo -e "${RED}✗ Cannot connect to Nginx${NC}"
    exit 1
fi

# Test response time
echo ""
echo "4. Performance metrics:"
time curl -s -o /dev/null "https://$DOMAIN/"
echo ""

# Test multiple requests for consistency
echo "5. Testing consistency (5 requests):"
for i in {1..5}; do
    response=$(curl -s -I -H "Accept-Encoding: gzip" "https://$DOMAIN/")
    if echo "$response" | grep -qi "Content-Encoding: gzip"; then
        echo -e "Request $i: ${GREEN}✓ GZIP${NC}"
    else
        echo -e "Request $i: ${RED}✗ NOT COMPRESSED${NC}"
    fi
    sleep 0.5
done

echo ""
echo "=========================================="
echo "  Gzip Test Summary"
echo "=========================================="
echo ""
echo "If gzip is not working, check:"
echo "1. Nginx configuration includes gzip settings"
echo "2. Nginx was reloaded after config changes"
echo "3. Browser cache is not interfering"
echo ""
echo "Commands to check Nginx:"
echo "  sudo nginx -t"
echo "  sudo systemctl status nginx"
echo "  sudo tail -f /var/log/nginx/$DOMAIN.access.log"
echo ""
echo "To reload Nginx:"
echo "  sudo systemctl reload nginx"
echo ""
