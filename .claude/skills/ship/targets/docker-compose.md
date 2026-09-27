# Target: Docker Compose on a VPS

No control plane. Everything is the compose file, an env file on the host, and your discipline.

## Where state lives

- Env vars: an `.env` file on the host, next to the compose file, never in the repo. Keep a committed `.env.example` listing every required key so parity is checkable.
- Secrets: same file, or Docker secrets if the deployment uses swarm. Either way, not in the image.
- Routing and TLS: whatever reverse proxy the compose file declares. Changes to it are part of the deploy, not a separate manual step.
- Data: named volumes. Confirm the volume name has not changed, because a renamed volume silently starts empty.

## Deploying

```
git pull
docker compose build <service>
docker compose up -d --no-deps <service>
docker compose logs -f --tail=100 <service>
```

- `--no-deps` stops it restarting the database along with the app.
- Deploy one service at a time, in the order from the skill. `docker compose up -d` with no service name restarts everything at once.
- Migrations: a one-shot container run before the API comes up, `docker compose run --rm <service> <migrate-command>`.
- Prune images after, or the disk fills. `docker image prune -f` on a schedule.

## Rollback

There is no deployment history. Tag images with the commit sha at build time and keep the previous
tag, or rolling back means rebuilding from an older commit while the site is down.

```
docker compose build --build-arg GIT_SHA=$(git rev-parse --short HEAD) <service>
```

## Traps

- `docker compose up -d` after a pull restarts every service whose config hash changed, including the database.
- An `.env` key added to the repo's example file but not to the host file fails at boot with no warning beforehand.
- No health check means compose reports the container as up the instant the process starts, before it can serve anything.
