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

For ordinary Nuxt development only, copy `.env.example` to `.env` and deliberately set:

```text
NUXT_DEV_AUTH_BYPASS=true
```

The bypass also requires Nuxt's compile-time development mode. A production build ignores it and fails closed when the Cloudflare Access team domain, application audience, or signed assertion is absent. Do not put the bypass in `.dev.vars`, Wrangler configuration, CI, previews, or production.

## Cloudflare environments

The checked-in `wrangler.jsonc` defines explicit `local`, INPA-owned `preview`, and INPA-owned `production` environments:

- `DB` for D1.
- `MEDIA` for R2.
- `ASSETS` for compiled Nuxt assets.

The INPA Cloudflare account currently owns `inpa-preview` and `inpa-production` D1 databases. R2 is intentionally not bound to either remote environment until R2 has been enabled in the account and the corresponding buckets exist. The server treats a missing `MEDIA` binding as unavailable rather than failing public requests.

Deployment commands:

```powershell
pnpm deploy:preview
pnpm deploy:production
```

Before editor access or the official domain is enabled, an authorised administrator must:

1. Obtain the official email address of each approved editor.
2. Configure a Cloudflare Access application for `/admin/**` and `/api/admin/**` with that explicit editor allowlist.
3. Supply `NUXT_CF_ACCESS_TEAM_DOMAIN` and `NUXT_CF_ACCESS_AUD` as protected runtime configuration.
4. Complete and acceptance-test the editor CRUD workflow before permitting production writes.
5. Enable R2 later, create preview and production buckets, and add their `MEDIA` bindings when INPA can provide the billing details required by Cloudflare.
6. Configure the approved domain, DNS, TLS, cache rules, logs and usage visibility.

The INPA-owned GitHub repository is connected to Cloudflare. Pushes to `main` automatically build and deploy the preview Worker. Production deployment remains explicit until the primary domain and release workflow are approved.

Namecheap nameserver changes remain deferred until the preview Worker has been verified.

## Content safety

The local seed is not official INPA content and must never be applied to a remote database. Public empty states do not invent missing announcements or institutional facts. See [`CONTENT_READINESS.md`](./CONTENT_READINESS.md) for the remaining beta inputs and operational blockers.
