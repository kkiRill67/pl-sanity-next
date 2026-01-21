# Docker Deployment Guide (Frontend Only)

This guide explains how to build and deploy the **Next.js frontend** application using Docker.

**Note:** This deployment is for the frontend only. Sanity Studio is deployed separately using `npx sanity deploy`.

## Prerequisites

1. **Docker** installed on your machine
2. **Sanity API Read Token** - Get it from:
   - https://manage.sanity.io
   - Select your project → API → Tokens
   - Create a new token with "Viewer" permission

## Setup

### 1. Configure Environment Variables

Copy the example file and fill in your values:

