# Docker Deployment Fix Summary

## Problem Fixed

**Original Error:** `ERROR [builder 10/10] RUN npm run build` with `SIGSEGV` (segmentation fault)

**Root Cause:** Alpine Linux + Node.js compatibility issues with memory management

## Solution Applied

### 1. Dockerfile Changes

**Changed:**
- Base image: `node:20-alpine` → `node:20-bookworm-slim` (Debian-based)
- Build command: `node --max-old-space-size=4096 node_modules/.bin/next build` → `npm run build` with `NODE_OPTIONS`
- Environment file: Creates `.env.local` instead of `.env`

**Key fixes:**
```dockerfile
# Before (caused SIGSEGV)
FROM node:20-alpine AS builder
RUN node --max-old-space-size=4096 node_modules/.bin/next build

# After (fixed)
FROM node:20-bookworm-slim AS builder
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build
```

### 2. Environment Variables

**Created files:**
- `.env.local` - Your local environment (gitignored)
- `.env.example` - Template for documentation
- `.dockerignore` - Updated to exclude `.env.local`

**Build args supported:**
- `SANITY_API_READ_TOKEN` ✅
- `NEXT_PUBLIC_SANITY_PROJECT_ID` ✅
- `NEXT_PUBLIC_SANITY_DATASET` ✅
- `NEXT_PUBLIC_SANITY_API_VERSION` ✅
- `NEXT_PUBLIC_SANITY_STUDIO_URL` ✅

### 3. Build Scripts

**Created:**
- `build.sh` - Easy build script that loads `.env.local` or uses CI env vars
- Updated `build-local.sh` - Fixed to use `.env.local`

**Usage:**
```bash
# Local development
./build.sh my-app:latest

# With docker-compose
docker-compose --profile dev up --build
```

### 4. Docker Compose

**Updated `docker-compose.yml`:**
- Uses `.env.local` for environment variables
- Added profiles: `dev` and `prod`

**Created `docker-compose.override.yml`:**
- For local development with hot-reload
- Volume mounts for development

### 5. GitHub Actions

**Existing workflows:**
- `.github/workflows/docker-build.yml` - Builds and pushes to GHCR
- `.github/workflows/deploy.yml` - Deploys to VDS

**Created:**
- `.github/workflows/docker-test-build.yml` - Test build for PRs

**Secrets required for GitHub Actions:**
```bash
SANITY_API_READ_TOKEN
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
NEXT_PUBLIC_SANITY_API_VERSION
NEXT_PUBLIC_SANITY_STUDIO_URL
```

### 6. Documentation

**Created:**
- `DOCKER_DEPLOYMENT.md` - Complete Docker deployment guide
- `GITHUB_SECRETS_SETUP.md` - GitHub secrets configuration guide
- Updated `README.md` - Added Docker deployment section

## How to Use

### Local Development

1. **Setup environment:**
```bash
cp .env.example .env.local
# Edit .env.local with your actual values
```

2. **Build and run:**
```bash
./build.sh my-app:latest
docker run -p 3000:3000 my-app:latest
```

Or with docker-compose:
```bash
docker-compose --profile dev up --build
```

### GitHub Actions CI/CD

1. **Set up secrets** in GitHub repository (see `GITHUB_SECRETS_SETUP.md`)
2. **Push to main branch** to trigger automatic build
3. **Image will be available** at `ghcr.io/your-username/your-repo:latest`

### VDS Deployment

1. **Set up secrets** in GitHub:
   - `SSH_HOST` - Your server IP/domain
   - `SSH_USER` - SSH username
   - `SSH_PRIVATE_KEY` - SSH private key
   - `DEPLOY_PATH` - Deployment directory (e.g., `/var/www/app`)
   - All Sanity secrets listed above

2. **Push to main** to trigger deployment

## Files Overview

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage build (fixed SIGSEGV) |
| `docker-compose.yml` | Production compose config |
| `docker-compose.override.yml` | Dev overrides |
| `.env.local` | Your secrets (gitignored) |
| `.env.example` | Template |
| `build.sh` | Build script |
| `build-local.sh` | Legacy build script |
| `DOCKER_DEPLOYMENT.md` | Docker guide |
| `GITHUB_SECRETS_SETUP.md` | GitHub secrets guide |
| `.github/workflows/docker-build.yml` | GHCR build |
| `.github/workflows/deploy.yml` | VDS deploy |
| `.github/workflows/docker-test-build.yml` | PR test |

## Verification

After applying these changes, the build should:

1. ✅ Complete without SIGSEGV
2. ✅ Use correct environment variables
3. ✅ Build with proper memory allocation
4. ✅ Create working production image

## Troubleshooting

### Still getting SIGSEGV?
- Ensure you're using the updated Dockerfile
- Try increasing memory: `ENV NODE_OPTIONS="--max-old-space-size=8192"`

### Missing environment variables?
- Check `.env.local` exists and has correct values
- For CI/CD, verify GitHub secrets are set
- Run `./build.sh` to see what's being used

### Build fails with "Missing SANITY_API_READ_TOKEN"?
- Your token is not being passed correctly
- Check build args in Dockerfile
- Verify secrets in CI/CD

## Next Steps

1. ✅ Review and apply all file changes
2. ✅ Create `.env.local` with your credentials
3. ✅ Test local build: `./build.sh test-app`
4. ✅ Set up GitHub secrets
5. ✅ Test CI/CD by pushing to a branch
6. ✅ Deploy to production