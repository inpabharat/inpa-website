# INPA website

Local-first foundation for the Indian Nuclear Physics Association public website and future protected editor surface.

The project uses Nuxt 4.5.1, Vue 3, strict TypeScript, Nuxt server routes, Drizzle ORM, and Cloudflare-compatible D1 and R2 bindings. It does not create or require a Cloudflare account for ordinary local UI development.

## Prerequisites

- Node.js 20.19 or newer (Node 24 LTS is recommended).
- pnpm 11.

## First local setup

```powershell
pnpm install
Copy-Item .env.example .env
pnpm db:setup:local
```

`db:setup:local` applies the checked-in migrations and loads unmistakably labelled local-only fixtures. The seed command always uses Wrangler's `--local` flag and does not contact a remote database.

## Development modes

For fast Vue and layout work with hot module replacement:

```powershell
pnpm dev
```

The standard Nuxt development server does not provide Cloudflare bindings. Public database sections therefore render their safe empty states.

To exercise the compiled Worker with locally simulated D1 and R2 bindings:

```powershell
pnpm db:setup:local
pnpm build
pnpm preview
```

Wrangler serves the Worker locally and stores simulated resource state under `.wrangler/state`. No Cloudflare login is needed for local bindings.

## Quality commands

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Database commands:

```powershell
pnpm db:generate
pnpm db:migrate:local
pnpm db:seed:local
pnpm db:setup:local
pnpm db:migrate:preview
pnpm db:migrate:production
```

Remote migrations are always explicit. Never load `drizzle/seed.local.sql` into a remote database.

## Local editor boundary

`/admin/**` and `/api/admin/**` are enforced by server middleware. By default they return `403` because Cloudflare Access is not configured.

For the standard Nuxt development server, copy `.env.example` to `.env` and deliberately set:

```text
NUXT_DEV_AUTH_BYPASS=true
```

For the locally simulated Worker, copy `.dev.vars.example` to `.dev.vars`. The bypass requires both the explicit opt-in and the checked-in `local` environment marker. Preview and production are marked separately and fail closed when the Cloudflare Access team domain, application audience, or signed assertion is absent. Never configure the bypass in preview, production, or CI.

## Cloudflare environments

The checked-in `wrangler.jsonc` defines explicit `local`, INPA-owned `preview`, and INPA-owned `production` environments:

- `DB` for D1.
- `MEDIA` for R2.
- `ASSETS` for compiled Nuxt assets.

The INPA Cloudflare account owns separate `inpa-preview` and `inpa-production` D1 databases and separate `inpa-media-preview` and `inpa-media-production` R2 buckets. All four resources are explicitly bound by environment. Media objects use random immutable keys and are never seeded into production.

Deployment commands:

```powershell
pnpm deploy:preview
pnpm upload:production
pnpm deploy:production
```

`deploy:preview` updates the preview Worker immediately. `upload:production` creates a candidate version on the production Worker without sending it live; an authorised administrator can then open **Workers & Pages → inpa-website → Deployments → Promote deployment** and select that version. `deploy:production` is the direct command-line alternative and immediately sends the new version to all production traffic.

Before editor access or the official domain is enabled, an authorised administrator must:

1. Obtain the official email address of each approved editor.
2. Configure a Cloudflare Access application for `/admin/**` and `/api/admin/**` with that explicit editor allowlist.
3. Supply `NUXT_CF_ACCESS_TEAM_DOMAIN` and `NUXT_CF_ACCESS_AUD` as protected runtime configuration.
4. Acceptance-test the completed editor workflow through Cloudflare Access before permitting production writes.
5. Configure the approved domain, DNS, TLS, cache rules, logs and usage visibility.

See [`docs/editor-guide.md`](./docs/editor-guide.md) and [`docs/deployment.md`](./docs/deployment.md).

The INPA-owned GitHub repository is connected to Cloudflare. Pushes to `main` automatically build and deploy the preview Worker. Production deployment remains explicit until the primary domain and release workflow are approved.

Namecheap nameserver changes remain deferred until the preview Worker has been verified.

## Content safety

The local seed is not official INPA content and must never be applied to a remote database. Public empty states do not invent missing announcements or institutional facts. See [`CONTENT_READINESS.md`](./CONTENT_READINESS.md) for the remaining beta inputs and operational blockers.
