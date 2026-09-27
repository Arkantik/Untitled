---
name: docker-service
description: Author or review a Dockerfile, compose file, or service topology. Use when adding a new service, changing a build, splitting workers out, or when a container behaves differently from local dev.
---

# Docker service

Applies to authoring a new service and to reviewing an existing one. Review mode: read the Dockerfile, the compose file, and `.dockerignore` together, then report against the checklist below. Do not rewrite without approval.

## Topology first

Decide what runs as its own container before writing any Dockerfile.

- Queue workers run as a separate service from the API. A worker chewing through a batch competes with request handling for CPU in the same container, and it cannot be scaled or restarted independently.
- A service that Traefik routes to needs a health endpoint. A service that only consumes a queue needs a health check that proves queue connectivity, not just process liveness.
- Anything with a distinct scaling profile or a distinct crash blast radius is its own service. Everything else is not.

## Build

- Multi-stage always. Build stage installs dev dependencies and compiles, runtime stage copies only the built output and production dependencies.
- Monorepo: prune the workspace before copying (`turbo prune --scope=<app> --docker` or the pnpm deploy equivalent). Copying the whole repo into the context makes every service rebuild on every change and inflates the image.
- `.dockerignore` must exclude `node_modules`, `.git`, `.next`, `dist`, and local env files. Missing this sends hundreds of megabytes to the daemon and can leak a local `.env` into the image.
- Pin the base image to a specific minor version, not `latest` and not a bare major.
- Lockfile-driven install with a frozen flag. An install that resolves fresh versions at build time means the image you tested is not the image you shipped.

## Runtime

- Set a non-root `USER`. Node images ship a `node` user. Use it.
- Set `NODE_ENV=production` in the runtime stage.
- Declare a `HEALTHCHECK`, or configure one in Coolify, for every service another service depends on.
- Handle `SIGTERM`. A worker that dies on signal without draining loses in-flight jobs. A web server that ignores it makes every deploy drop connections.
- One process per container. No supervisor, no shell script running two things.

## Secrets and config

- Runtime config comes from environment variables read at startup. Build args are baked into layers and readable by anyone with the image.
- Framework variables prefixed for client exposure (`NEXT_PUBLIC_*` and equivalents) are compile-time. If one changes, the image is stale, not the container.
- Static assets served from the framework's public directory are copied at build. Adding a file there requires a rebuild, not a restart.

## Networking

- Services talk to each other by service name on an internal network. Only the edge service is exposed to Traefik.
- The database and the cache are never published to the host. If a port mapping exists on Postgres or Valkey in a production compose file, that is a finding, not a style preference.

## Review checklist

Report each as pass, fail, or not applicable. Cite the line.

1. Base image pinned
2. Multi-stage, runtime stage free of dev dependencies and source
3. `.dockerignore` present and covering node_modules, git, build output, env files
4. Non-root user
5. Lockfile-frozen install
6. No secrets in build args or `ENV`
7. Health check present for routed and depended-on services
8. Signal handling for graceful shutdown
9. No host port mapping on datastores
10. Worker separated from API

## Hard rules

- Never put a secret in a build arg.
- Never publish a datastore port in a production topology.
- Never combine the API and a queue worker in one container to save a service slot.
