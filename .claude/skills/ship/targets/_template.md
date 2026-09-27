# Target: <name>

Copy this file, fill it in, and reference it from the deploy target line in root CLAUDE.md.
Delete the sections that do not apply. An empty heading is worse than a missing one.

## Where state lives

- Env vars: <where, and how to check whether a key is set>
- Secrets: <where>
- Routing and TLS: <what manages it>
- Persistent data: <what survives a redeploy, and what does not>

## Build

```
<the command that produces exactly what the platform produces>
```

## Deploying

- <what triggers a deploy>
- <how to deploy one service without touching the others>
- <where migrations run, and when relative to the code>
- <what "deployed" means here, and what it does not prove>

## Rollback

<the exact steps, and how long they take. If there is no rollback, write that down. Knowing it
in advance is worth more than discovering it mid-incident.>

## Traps

<Fill this in as you hit them. This section is the reason the file exists. Every entry should be
something that cost you time once and will not cost it twice.>
