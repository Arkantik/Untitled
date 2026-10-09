# Contributing to Veypost

Thanks for your interest in contributing. This guide covers what you need to get started.

## Prerequisites

- Node.js 24+
- pnpm 10+
- Docker and Docker Compose (for PostgreSQL and Valkey)

## Setup

```bash
git clone https://github.com/Arkantik/Untitled.git
cd Untitled
pnpm install
```

Start the dev infrastructure (PostgreSQL + Valkey):

```bash
docker compose -f docker/docker-compose.yml up -d
```

Copy the environment file and fill in values:

```bash
cp .env.example .env
```

Start the dev servers:

```bash
pnpm dev
```

- Web: http://localhost:3000
- API: http://localhost:3001
- Swagger: http://localhost:3001/api/docs

## Project Structure

| Path               | Description                                      |
| ------------------ | ------------------------------------------------ |
| `apps/api/`        | NestJS backend with Fastify                      |
| `apps/web/`        | TanStack Start frontend with React               |
| `packages/db/`     | Drizzle schemas (SQLite + PostgreSQL), migrations |
| `packages/shared/` | Shared types, constants, Zod schemas             |
| `docker/`          | Dockerfile, compose files, supervisord           |

## Development Workflow

1. Fork the repo and create a branch from `main`.
2. Make your changes.
3. Run `pnpm build` and `pnpm typecheck` to verify everything compiles.
4. Commit with a clear message describing what changed and why.
5. Open a pull request against `main`.

## Guidelines

- All source code is TypeScript. No `.js` files outside config.
- Database schemas must exist for both SQLite and PostgreSQL.
- Shared types and constants go in `@veypost/shared`, not duplicated across packages.
- Secrets are only read in `apps/api/src/config/env.ts`.
- Keep pull requests focused. One concern per PR.

## Reporting Bugs

Open an issue with:

- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, browser)

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). By participating, you agree to uphold it.
