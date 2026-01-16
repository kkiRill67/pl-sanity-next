#!/bin/bash

# Load environment variables from .env.local
set -a
source .env.local
set +a

# Build Docker image with environment variables
docker-compose --profile dev build --no-cache

# Or build directly with docker build
# docker build \
#   --build-arg NEXT_PUBLIC_SANITY_PROJECT_ID=${NEXT_PUBLIC_SANITY_PROJECT_ID} \
#   --build-arg NEXT_PUBLIC_SANITY_DATASET=${NEXT_PUBLIC_SANITY_DATASET} \
#   --build-arg NEXT_PUBLIC_SANITY_API_VERSION=${NEXT_PUBLIC_SANITY_API_VERSION} \
#   --build-arg NEXT_PUBLIC_SANITY_STUDIO_URL=${NEXT_PUBLIC_SANITY_STUDIO_URL} \
#   --build-arg SANITY_API_READ_TOKEN=${SANITY_API_READ_TOKEN} \
#   -t test-app:dev .
