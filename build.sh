#!/bin/bash

# Build script for Docker with Sanity configuration
# Usage: ./build.sh [tag]

set -e

# Load environment variables from .env.local (if exists and not in CI)
if [ -f .env.local ] && [ -z "$CI" ]; then
    echo "Loading environment variables from .env.local..."
    export $(grep -v '^#' .env.local | xargs)
else
    echo "Using environment variables from CI/CD or system..."
fi

# Set default tag
TAG=${1:-test-app}

echo "Building Docker image: $TAG"
echo "Project ID: ${NEXT_PUBLIC_SANITY_PROJECT_ID:-not set}"
echo "Dataset: ${NEXT_PUBLIC_SANITY_DATASET:-not set}"

# Check if required variables are set
if [ -z "$SANITY_API_READ_TOKEN" ]; then
    echo "Warning: SANITY_API_READ_TOKEN is not set"
fi

# Build the image
docker build \
    --build-arg SANITY_API_READ_TOKEN="$SANITY_API_READ_TOKEN" \
    --build-arg NEXT_PUBLIC_SANITY_PROJECT_ID="$NEXT_PUBLIC_SANITY_PROJECT_ID" \
    --build-arg NEXT_PUBLIC_SANITY_DATASET="$NEXT_PUBLIC_SANITY_DATASET" \
    --build-arg NEXT_PUBLIC_SANITY_API_VERSION="$NEXT_PUBLIC_SANITY_API_VERSION" \
    --build-arg NEXT_PUBLIC_SANITY_STUDIO_URL="$NEXT_PUBLIC_SANITY_STUDIO_URL" \
    -t "$TAG" .

echo ""
echo "Build complete! Run with:"
echo "  docker run -p 3000:3000 $TAG"