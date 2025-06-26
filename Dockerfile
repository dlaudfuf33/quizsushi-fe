# --- Builder Stage ---
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install && pnpm build

# --- Runtime Stage ---
FROM node:20-alpine AS runner

WORKDIR /app
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/package.json package.json

RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --prod

ENV NODE_ENV=production

EXPOSE 3000

CMD ["pnpm", "start"]