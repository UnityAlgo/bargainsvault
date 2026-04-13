# ---- Stage 1: Install all dependencies ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ---- Stage 2: Build the Next.js app ----
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- Stage 3: Production runner ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Copy built app
COPY --from=builder --chown=nextjs:nodejs /app/.next        ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public       ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/drizzle      ./drizzle

# Install only production dependencies (fresh, correct platform binaries)
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Migration runner and entrypoint
COPY --chown=nextjs:nodejs scripts/migrate.mjs    ./migrate.mjs
COPY --chown=nextjs:nodejs docker-entrypoint.sh   ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

USER nextjs
EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
