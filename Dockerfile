#
# Multi-stage Dockerfile for job-scheduler-service
#
# Stage 1: Build (install deps + compile TypeScript to dist/)
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies (full, including dev) for building
COPY .env ./
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit --no-fund

# Copy source and build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Stage 2: Production runtime (only prod deps + dist)
FROM node:22-alpine AS runner

ENV NODE_ENV=production
ENV HUSKY=0
WORKDIR /app

# Install only production dependencies for a smaller image
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts --prefer-offline --no-audit --no-fund

# Copy compiled output from builder
COPY --from=builder /app/dist ./dist

# Use non-root user provided by the Node image
USER node

# Service listens on 3000 by default (can be overridden via PORT env)
EXPOSE 3000

# Start the service
CMD ["node", "dist/server.js"]


