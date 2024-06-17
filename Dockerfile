# Build time
FROM oven/bun:1-alpine as builder

WORKDIR /app
ENV NODE_ENV production

COPY package.json .
COPY bun.lockb .
RUN bun install --production --silent --frozen-lockfile

COPY src src
COPY tsconfig.json .
RUN bun run build

# Run time
FROM oven/bun:1-alpine as runner

WORKDIR /app
ENV NODE_ENV production

COPY --from=builder --chown=bun /app/out .

USER bun
EXPOSE 4000
ENTRYPOINT [ "bun", "index.js" ]