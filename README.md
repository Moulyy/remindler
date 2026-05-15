# Remindler

Remindler is a family and home organization application for couples, families, shared
homes, and roommates.

The goal is to reduce domestic mental load by making everyday responsibilities explicit:
what needs to be done, who is responsible for it, when it is due, and what its current
status is.

## Architecture

Remindler is a TypeScript monorepo managed with pnpm workspaces.

```text
apps/
  api/      Fastify API, HTTP routes, Prisma, runtime adapters
  web/      Frontend application

packages/
  domain/       Pure business models and rules
  application/  Use cases and ports
  shared/       Shared technical contracts only when truly needed
```

The project follows a hexagonal architecture direction:

- `packages/domain` owns business concepts such as `User`, `House`, `HouseMember`, and
  `HouseTask`.
- `packages/application` owns use cases such as registration, login, authenticated user
  lookup, logout, and house creation.
- `apps/api` wires runtime dependencies, exposes HTTP endpoints, and implements
  infrastructure adapters with Prisma.
- `apps/web` remains frontend-specific and should not contain backend or domain
  infrastructure.

Dependencies should point inward:

```text
apps/api -> packages/application -> packages/domain
apps/web -> packages/shared
```

Packages must not import from `apps/*`.

## Backend

The API is built with Fastify and PostgreSQL through Prisma.

Current authentication uses opaque database sessions:

- login creates a random session token
- only the token hash is stored in the database
- protected endpoints read `Authorization: Bearer <token>`
- sessions can expire, be renewed, and be revoked on logout

Available auth endpoints:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

House creation is protected:

```text
POST /api/houses
```

## Local Development

Install dependencies:

```bash
pnpm install
```

Start PostgreSQL:

```bash
docker compose up -d
```

Run database migrations:

```bash
pnpm --filter @remindler/api db:migrate
```

Start the API:

```bash
pnpm dev:api
```

Start the web app:

```bash
pnpm dev:web
```

Open Prisma Studio:

```bash
pnpm --filter @remindler/api prisma:studio
```

## Verification

Run checks in this order:

```bash
pnpm lint
pnpm test
pnpm build
```
