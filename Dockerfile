# syntax=docker/dockerfile:1.4
# Builder stage
FROM node:20-bookworm-slim AS builder

# Accept build arguments for Sanity configuration
ARG NEXT_PUBLIC_SANITY_PROJECT_ID
ARG NEXT_PUBLIC_SANITY_DATASET
ARG NEXT_PUBLIC_SANITY_API_VERSION
ARG NEXT_PUBLIC_SANITY_STUDIO_URL
ARG SANITY_API_READ_TOKEN

# Install Sanity CLI (required for typegen scripts)
RUN npm install -g @sanity/cli

WORKDIR /app

# Install root dependencies (including workspaces)
COPY package.json package-lock.json ./
RUN npm ci

# Copy all source code
COPY . .

WORKDIR /app/frontend
# Install frontend dependencies
RUN npm ci

# Create .env.local file for build (Next.js reads .env.local first)
RUN echo "SANITY_API_READ_TOKEN=${SANITY_API_READ_TOKEN}" > .env.local && \
  echo "NEXT_PUBLIC_SANITY_PROJECT_ID=${NEXT_PUBLIC_SANITY_PROJECT_ID}" >> .env.local && \
  echo "NEXT_PUBLIC_SANITY_DATASET=${NEXT_PUBLIC_SANITY_DATASET}" >> .env.local && \
  echo "NEXT_PUBLIC_SANITY_API_VERSION=${NEXT_PUBLIC_SANITY_API_VERSION}" >> .env.local && \
  echo "NEXT_PUBLIC_SANITY_STUDIO_URL=${NEXT_PUBLIC_SANITY_STUDIO_URL}" >> .env.local && \
  echo "=== .env.local file ===" && \
  cat .env.local && \
  echo "=== end .env.local ==="
# Set as environment variables for the build
ENV NEXT_PUBLIC_SANITY_PROJECT_ID=$NEXT_PUBLIC_SANITY_PROJECT_ID
ENV NEXT_PUBLIC_SANITY_DATASET=$NEXT_PUBLIC_SANITY_DATASET
ENV NEXT_PUBLIC_SANITY_API_VERSION=$NEXT_PUBLIC_SANITY_API_VERSION
ENV NEXT_PUBLIC_SANITY_STUDIO_URL=$NEXT_PUBLIC_SANITY_STUDIO_URL
ENV SANITY_API_READ_TOKEN=$SANITY_API_READ_TOKEN

# Skip lifecycle scripts (prebuild runs typegen which may fail in the container)
ENV npm_config_ignore_scripts=true
# Use npm run build with increased memory limit
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build
# Re‑enable scripts for any later steps
ENV npm_config_ignore_scripts=false
ENV NODE_OPTIONS=""

# Production stage
FROM node:20-alpine
WORKDIR /app/frontend

# Copy built assets and production dependencies from builder
COPY --from=builder /app/frontend/package.json .
COPY --from=builder /app/frontend/.next ./.next
COPY --from=builder /app/frontend/public ./public
COPY --from=builder /app/frontend/next.config.ts .
COPY --from=builder /app/frontend/tsconfig.json .
COPY --from=builder /app/frontend/next-env.d.ts .

# Install production dependencies for frontend
RUN npm i --production

EXPOSE 3000
CMD ["npm","start"]

