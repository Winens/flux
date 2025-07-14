# -----------------------------
# 1. Base image
# -----------------------------
FROM oven/bun:latest AS base
WORKDIR /usr/src/app

# -----------------------------
# 2. Install dependencies
# -----------------------------
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Only production dependencies
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# -----------------------------
# 3. Prerelease: Copy source & build
# -----------------------------
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

ENV NODE_ENV=production

# ✅ Use script from package.json
RUN bun run build

# -----------------------------
# 4. Final image: runtime only
# -----------------------------
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/dist/server.js .
COPY --from=prerelease /usr/src/app/package.json .

USER bun
EXPOSE 7668/tcp
ENTRYPOINT [ "bun", "server.js" ]