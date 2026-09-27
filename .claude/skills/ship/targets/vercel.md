# Target: Vercel

Builds from git. The platform handles rollout, so the risk concentrates in configuration and in
anything that is not the frontend.

## Where state lives

- Env vars: project settings, scoped per environment (production, preview, development). A variable set for preview only is absent in production, and the error appears at runtime.
- Secrets: same place. Anything prefixed for client exposure is public, whatever the settings page calls it.
- Domains: project settings. Apex and `www` both need configuring, with one redirecting.

## Build

```
vercel build          # reproduces the platform build locally
vercel deploy --prebuilt --prod
```

Running the framework's own build command locally is not the same thing. `vercel build` applies the
platform's configuration, which is where the difference usually is.

## Deploying

- A push to the production branch deploys. Confirm which branch that is before merging anything.
- Preview deployments are free verification. Use one, exercise the real path on the preview URL, then promote.
- Serverless function constraints matter: execution timeout, response size, and cold starts on anything doing real work. Long jobs do not belong here. They belong in a queue on a machine you control.
- Migrations do not run here. They run from your machine or from CI against the database, before promoting.

## Rollback

Instant promotion of a previous deployment from the dashboard. This is the one thing Vercel makes
genuinely easy. It does not undo a migration.

## Traps

- Env var changed in settings: existing deployments keep the old value. Redeploy to pick it up.
- A build that succeeds locally and fails on the platform is almost always a case-sensitivity difference or a devDependency the build needs at runtime.
- Edge and Node runtimes differ in available APIs. Check which one each route runs on.
