# Build context is the repo root (Dokploy "Build Path": /)
FROM node:22-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# psql is used by scripts/start.sh to import database/bibliothèque.sql on
# first boot (the pg_dump COPY blocks it contains can't be run through the
# node pg driver's query protocol, only through psql).
RUN apk add --no-cache postgresql-client

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 bibliotheque

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./package.json
COPY src ./src
COPY public ./public
COPY database ./database
COPY scripts ./scripts

RUN chmod +x ./scripts/start.sh && chown -R bibliotheque:nodejs /app

USER bibliotheque

ENV PORT=8080
EXPOSE 8080

CMD ["./scripts/start.sh"]
