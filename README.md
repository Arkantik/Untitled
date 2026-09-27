# Pulsarr

Self-hosted social media scheduling and publishing platform. Compose once, publish everywhere.

An open-source alternative to Buffer, Hootsuite, and Typefully.

## Features

- Compose posts and publish to X, Bluesky, LinkedIn, Facebook, Instagram, Threads, and Discord
- Schedule posts with calendar views and recurring time slots
- Per-platform text overrides and character limit validation
- Analytics and engagement tracking per post and per account
- Team workspaces with role-based access
- REST API with auto-generated OpenAPI documentation
- Self-hosted with SQLite (zero-config) or PostgreSQL

## Quick Start

### Self-hosted (Docker)

```bash
docker compose -f docker/docker-compose.production.yml up -d
```

### Development

```bash
# Prerequisites: Node.js 24+, pnpm
pnpm install
pnpm dev
```

API runs on `http://localhost:3001`, web UI on `http://localhost:3000`.

For PostgreSQL and Valkey during development:

```bash
docker compose -f docker/docker-compose.yml up -d
```

## Tech Stack

See [TECH_STACK.md](TECH_STACK.md) for the full list.

- **Backend:** NestJS 12 (Fastify), Drizzle ORM, BullMQ, Better Auth
- **Frontend:** TanStack Start, React 19, Tailwind CSS v4, shadcn/ui
- **Database:** SQLite (default) or PostgreSQL 17
- **Queue/Cache:** Valkey 8
- **Monorepo:** Turborepo + pnpm workspaces

## Project Structure

```
apps/
  api/          NestJS backend (REST API)
  web/          TanStack Start frontend
packages/
  db/           Drizzle schemas and migrations
  shared/       Shared types, constants, validation
docker/         Dockerfile, compose files
docs/           Architecture decisions, conventions, tickets
```

## License

[Apache 2.0](LICENSE)
