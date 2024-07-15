FROM node:iron-alpine3.20 AS base

# Builder stage
FROM base AS builder

# Enable pnpm with corepack
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

# Final image
FROM base AS final

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules


EXPOSE 50049

CMD ["node", "dist/server.js"]





