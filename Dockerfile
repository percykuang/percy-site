# syntax=docker/dockerfile:1.7

ARG NODE_IMAGE=node:22-bookworm-slim
ARG PNPM_VERSION=10.18.2

FROM ${NODE_IMAGE} AS runtime-base
ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates openssl \
  && rm -rf /var/lib/apt/lists/*

FROM runtime-base AS base

ARG PNPM_VERSION
ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

RUN corepack enable \
  && corepack prepare "pnpm@${PNPM_VERSION}" --activate

FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps/web/package.json apps/web/package.json
COPY apps/admin/package.json apps/admin/package.json
COPY packages/config/package.json packages/config/package.json
COPY packages/data-access/package.json packages/data-access/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/ui/package.json packages/ui/package.json

RUN pnpm install --frozen-lockfile

FROM deps AS builder

ARG APP=web
ARG DATABASE_URL=postgresql://postgres:postgres@localhost:5432/percy_site
ENV DATABASE_URL=${DATABASE_URL}
ENV NODE_ENV=production
ENV NUXT_TELEMETRY_DISABLED=1

COPY . .

RUN pnpm --filter @ps/db db:generate
RUN pnpm --filter "@ps/${APP}" build

FROM deps AS db-runner

ARG DATABASE_URL=postgresql://postgres:postgres@localhost:5432/percy_site
ENV DATABASE_URL=${DATABASE_URL}
ENV NODE_ENV=production

COPY . .

RUN pnpm --filter @ps/db db:generate

CMD ["pnpm", "--filter", "@ps/db", "db:deploy"]

FROM runtime-base AS runner

ARG APP=web
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app

RUN groupadd --gid 1001 nodejs \
  && useradd --uid 1001 --gid nodejs --create-home --shell /usr/sbin/nologin nuxt
RUN mkdir -p /app/storage/uploads \
  && chown -R nuxt:nodejs /app/storage

COPY --from=builder --chown=nuxt:nodejs /app/apps/${APP}/.output ./.output

USER nuxt

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
