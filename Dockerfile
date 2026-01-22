# 1. Build stage (если билдим внутри Docker)
FROM node:20-alpine AS builder

ARG NEXT_PUBLIC_SANITY_PROJECT_ID
ARG NEXT_PUBLIC_SANITY_DATASET
ARG NEXT_PUBLIC_SANITY_API_VERSION
ARG NEXT_PUBLIC_SANITY_STUDIO_URL
ARG SANITY_API_READ_TOKEN

ENV NEXT_PUBLIC_SANITY_PROJECT_ID=$NEXT_PUBLIC_SANITY_PROJECT_ID
ENV NEXT_PUBLIC_SANITY_DATASET=$NEXT_PUBLIC_SANITY_DATASET
ENV NEXT_PUBLIC_SANITY_API_VERSION=$NEXT_PUBLIC_SANITY_API_VERSION
ENV NEXT_PUBLIC_SANITY_STUDIO_URL=$NEXT_PUBLIC_SANITY_STUDIO_URL
ENV SANITY_API_READ_TOKEN=$SANITY_API_READ_TOKEN

WORKDIR /app/frontend

# deps + build
COPY frontend/package.json ./
RUN npm i
COPY frontend/ .
RUN npm run build


# 2. Runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Копируем артефакты из builder
COPY --from=builder /app/frontend/.next/standalone ./
COPY --from=builder /app/frontend/.next/static ./.next/static
COPY --from=builder /app/frontend/public ./public

RUN npm init -y >/dev/null 2>&1 && \
  npm install --omit=dev next@15.5.9

EXPOSE 3000
CMD ["node", "server.js"]
