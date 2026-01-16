# Docker Deployment Guide

This guide explains how to build and deploy the Next.js + Sanity application using Docker.

## Prerequisites

1. **Docker** installed on your machine
2. **Sanity API Read Token** - Get it from:
   - https://manage.sanity.io
   - Select your project → API → Tokens
   - Create a new token with "Viewer" permission

## Setup

### 1. Configure Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:

```bash
SANITY_API_READ_TOKEN=your_actual_token_here
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
NEXT_PUBLIC_SANITY_STUDIO_URL=https://your-project.sanity.studio
```

### 2. Build the Docker Image

#### Option A: Using the build script (recommended)

```bash
./build.sh my-app:latest
```

#### Option B: Using docker-compose

```bash
docker-compose --profile dev build
```

#### Option C: Direct docker build

```bash
docker build \
  --build-arg SANITY_API_READ_TOKEN=$(grep SANITY_API_READ_TOKEN .env.local | cut -d'=' -f2) \
  --build-arg NEXT_PUBLIC_SANITY_PROJECT_ID=$(grep NEXT_PUBLIC_SANITY_PROJECT_ID .env.local | cut -d'=' -f2) \
  --build-arg NEXT_PUBLIC_SANITY_DATASET=$(grep NEXT_PUBLIC_SANITY_DATASET .env.local | cut -d'=' -f2) \
  --build-arg NEXT_PUBLIC_SANITY_API_VERSION=$(grep NEXT_PUBLIC_SANITY_API_VERSION .env.local | cut -d'=' -f2) \
  --build-arg NEXT_PUBLIC_SANITY_STUDIO_URL=$(grep NEXT_PUBLIC_SANITY_STUDIO_URL .env.local | cut -d'=' -f2) \
  -t my-app:latest .
```

### 3. Run the Container

#### Local development

```bash
docker run -p 3000:3000 my-app:latest
```

Or with docker-compose:

```bash
docker-compose --profile dev up --build
```

#### Production deployment

```bash
docker-compose --profile prod up --build -d
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SANITY_API_READ_TOKEN` | Your Sanity API read token | ✅ Yes |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Your Sanity project ID | ✅ Yes |
| `NEXT_PUBLIC_SANITY_DATASET` | Your Sanity dataset (usually "production") | ✅ Yes |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Sanity API version (e.g., "2025-01-01") | ✅ Yes |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | Your Sanity Studio URL | ✅ Yes |

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy Docker

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: |
          docker build \
            --build-arg SANITY_API_READ_TOKEN=${{ secrets.SANITY_API_READ_TOKEN }} \
            --build-arg NEXT_PUBLIC_SANITY_PROJECT_ID=${{ secrets.NEXT_PUBLIC_SANITY_PROJECT_ID }} \
            --build-arg NEXT_PUBLIC_SANITY_DATASET=${{ secrets.NEXT_PUBLIC_SANITY_DATASET }} \
            --build-arg NEXT_PUBLIC_SANITY_API_VERSION=${{ secrets.NEXT_PUBLIC_SANITY_API_VERSION }} \
            --build-arg NEXT_PUBLIC_SANITY_STUDIO_URL=${{ secrets.NEXT_PUBLIC_SANITY_STUDIO_URL }} \
            -t my-app:${{ github.sha }} .
            
      - name: Push to registry
        run: |
          docker tag my-app:${{ github.sha }} my-registry/my-app:latest
          docker push my-registry/my-app:latest
```

## Troubleshooting

### Error: "Missing SANITY_API_READ_TOKEN"

Make sure you've created `.env.local` with your token and are passing it correctly during build.

### Error: "Unauthorized - Session not found"

Your Sanity API token is invalid or doesn't have the correct permissions. Make sure:
1. The token is from the correct Sanity project
2. The token has "Viewer" permission
3. The token hasn't expired

### Error: "projectId can only contain a-z, 0-9 and dashes"

Your project ID contains invalid characters. Check your Sanity project ID at https://manage.sanity.io

### Build fails with out of memory

The Dockerfile already sets `NODE_OPTIONS="--max-old-space-size=4096"` for the build. If you still have issues, increase this value:

```dockerfile
ENV NODE_OPTIONS="--max-old-space-size=8196"
```

## Files Overview

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage Docker build definition |
| `docker-compose.yml` | Docker Compose configuration |
| `docker-compose.override.yml` | Local development overrides |
| `.env.local` | Your local environment variables (not committed) |
| `.env.example` | Template for environment variables |
| `build.sh` | Build script for easier deployment |
| `build-local.sh` | Legacy build script (uses docker-compose) |

## Production Considerations

1. **Security**: Never commit `.env.local` to version control
2. **Secrets**: Use your CI/CD platform's secret management for production builds
3. **Health Checks**: Add health checks to your docker-compose.yml for production
4. **Logging**: Configure proper logging for production environments
5. **SSL/TLS**: Use a reverse proxy (nginx, traefik) with SSL termination

## Next Steps

1. Deploy your Sanity Studio: `cd studio && npx sanity deploy`
2. Set up your production hosting (Vercel, AWS, GCP, etc.)
3. Configure your domain and SSL certificates
4. Set up monitoring and error tracking