# GitHub Secrets Setup Guide

This guide explains how to set up the required secrets in your GitHub repository for Docker builds.

## Required Secrets

You need to set up the following secrets in your GitHub repository:

### 1. Sanity API Token

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `SANITY_API_READ_TOKEN` | Your Sanity API read token | https://manage.sanity.io → Your Project → API → Tokens |

### 2. Sanity Configuration

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Your Sanity project ID | https://manage.sanity.io → Your Project → Settings |
| `NEXT_PUBLIC_SANITY_DATASET` | Your Sanity dataset (usually "production") | https://manage.sanity.io → Your Project → Datasets |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Sanity API version | Use `2025-01-01` or latest |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | Your Sanity Studio URL | https://your-project.sanity.studio |

## How to Set Secrets in GitHub

### Method 1: Via GitHub Web Interface

1. Go to your GitHub repository
2. Click on **Settings** (top right)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add each secret one by one:

```
Secret name: SANITY_API_READ_TOKEN
Secret value: your_actual_token_here
```

Repeat for all required secrets.

### Method 2: Via GitHub CLI

```bash
# Install GitHub CLI if not already installed
# https://cli.github.com/

# Set secrets
gh secret set SANITY_API_READ_TOKEN --body "your_token_here"
gh secret set NEXT_PUBLIC_SANITY_PROJECT_ID --body "your_project_id"
gh secret set NEXT_PUBLIC_SANITY_DATASET --body "production"
gh secret set NEXT_PUBLIC_SANITY_API_VERSION --body "2025-01-01"
gh secret set NEXT_PUBLIC_SANITY_STUDIO_URL --body "https://your-project.sanity.studio"
```

### Method 3: Via GitHub API

```bash
curl -X PUT \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/actions/secrets/SANITY_API_READ_TOKEN \
  -d '{"encrypted_value":"ENCRYPTED_VALUE","key_id":"KEY_ID"}'
```

## How to Get Your Sanity Credentials

### 1. Get Your Project ID and Dataset

1. Go to https://manage.sanity.io
2. Select your project
3. The **Project ID** is shown in the URL or on the dashboard
4. Go to **Datasets** to see your dataset name (usually "production")

### 2. Get Your API Read Token

1. In the same project, go to **API** → **Tokens**
2. Click **Add token**
3. Name it (e.g., "GitHub Actions")
4. Select **Viewer** permission (read-only is sufficient for builds)
5. **Copy the token immediately** - you can't see it again
6. Use this token for `SANITY_API_READ_TOKEN`

### 3. Get Your Studio URL

Your Studio URL is typically: `https://your-project-id.sanity.studio`

You can find it by:
1. Going to https://manage.sanity.io
2. Selecting your project
3. Clicking **Studio** in the left sidebar
4. The URL is shown there

## Example Secrets Configuration

```
SANITY_API_READ_TOKEN=skYourTokenHere1234567890abcdef
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123xyz
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
NEXT_PUBLIC_SANITY_STUDIO_URL=https://abc123xyz.sanity.studio
```

## Testing Your Secrets

After setting up secrets, you can test them by:

1. Triggering a manual workflow run:
   - Go to **Actions** tab
   - Select **Build and Push Docker Image**
   - Click **Run workflow**

2. Or push to the `main` branch to trigger the workflow automatically

## Troubleshooting

### Error: "Secret not found"

Make sure:
1. The secret name matches exactly (case-sensitive)
2. The secret is set for the correct repository
3. You have the right permissions to access secrets

### Error: "SANITY_API_READ_TOKEN is not set"

Check your GitHub Actions workflow file (`.github/workflows/docker-build.yml`) and ensure the build-args are correctly referencing the secrets:

```yaml
build-args: |
  SANITY_API_READ_TOKEN=${{ secrets.SANITY_API_READ_TOKEN }}
```

### Build fails with authentication errors

Your Sanity token might be invalid or expired. Regenerate it and update the secret.

## Security Best Practices

1. **Never commit secrets** to your repository
2. **Use Viewer permission** for API tokens (not Admin)
3. **Rotate tokens** periodically
4. **Use different tokens** for different environments
5. **Monitor token usage** in Sanity dashboard
6. **Revoke unused tokens** immediately

## Local Development

For local development, create a `.env.local` file (not committed to git):

```bash
cp .env.example .env.local
# Edit .env.local with your actual values
```

Then build locally:
```bash
./build.sh my-app:latest
```

## CI/CD Pipeline

The GitHub Actions workflow will:
1. Check out your code
2. Validate that all required secrets are set
3. Build the Docker image with your secrets
4. Push to GitHub Container Registry (ghcr.io)
5. Tag with branch name and commit SHA

The built image will be available at:
```
ghcr.io/YOUR_USERNAME/YOUR_REPO:main
ghcr.io/YOUR_USERNAME/YOUR_REPO:latest
```