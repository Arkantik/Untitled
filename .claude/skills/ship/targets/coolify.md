# Target: Coolify on a VPS

Default target. Coolify builds and runs each service independently and holds configuration outside
the repo, which is where most breakage originates.

## Where state lives

- Env vars: the Coolify UI, per application, per environment. Not in the repo. Adding a key to the env schema without setting it there crashes the container on boot.
- Secrets: same place, marked as secrets. Never passed as build args.
- Domains and TLS: Coolify manages Traefik labels. Editing routing by hand in a compose file fights it.
- Persistent data: named volumes declared in the Coolify service config. A volume that only exists in a local compose file does not exist in production.

## Build

```
docker build -f <path/to/Dockerfile> -t <service>:preflight .
```

Coolify builds from the repo root by default. If the build context in the UI differs from the one
you build locally, the local check proves nothing. Confirm they match.

Monorepo: prune the workspace into the build context (`turbo prune --scope=<app> --docker`, or the
pnpm deploy equivalent) so one service's build does not pull the whole repo.

## Deploying

- Redeploy triggers per application. A shared package change means clicking redeploy on each dependent service, or the old image keeps serving.
- Coolify shows a green deploy when the container starts. It does not check your health endpoint unless one is configured. Configure one.
- Migrations: run as a pre-deploy command on the API service, or by hand against the database before redeploying. Decide which, and write it in root CLAUDE.md. Never in the container entrypoint of a service that can scale past one replica.

## Rollback

Coolify keeps previous deployments. Redeploy the prior commit from the deployments list. Note the
current one before you start so you are not reading through a list under pressure.

## Traps seen on this setup

- `NEXT_PUBLIC_*` changed in the UI and the app restarted: the value is still the old one. These are baked at build time. Rebuild.
- Apex and `www` both resolve but only one is configured: auth cookies set on one are invisible on the other.
- Files added to the framework's public directory need a rebuild, not a restart.
