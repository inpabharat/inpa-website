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
```

Do not run `db:migrate:remote` or `deploy` until an INPA-owned Cloudflare account, production resource identifiers, and an approved deployment process exist.

## Local editor boundary

`/admin/**` and `/api/admin/**` are enforced by server middleware. By default they return `403` because Cloudflare Access is not configured.

For ordinary Nuxt development only, copy `.env.example` to `.env` and deliberately set:

```text
NUXT_DEV_AUTH_BYPASS=true
```

The bypass also requires Nuxt's compile-time development mode. A production build ignores it and fails closed when the Cloudflare Access team domain, application audience, or signed assertion is absent. Do not put the bypass in `.dev.vars`, Wrangler configuration, CI, previews, or production.

## Cloudflare setup deferred until account ownership exists

The checked-in `wrangler.jsonc` uses a clearly local placeholder D1 identifier and logical bindings:

- `DB` for D1.
- `MEDIA` for R2.
- `ASSETS` for compiled Nuxt assets.

After INPA creates and owns its Cloudflare account, an authorised administrator must:

1. Create production and preview D1 databases and R2 buckets.
2. Replace local placeholder resource identifiers in the appropriate Wrangler environments.
3. Configure a Cloudflare Access application for `/admin/**` and `/api/admin/**` with an explicit editor allowlist.
4. Supply `NUXT_CF_ACCESS_TEAM_DOMAIN` and `NUXT_CF_ACCESS_AUD` as protected runtime configuration.
5. Connect the GitHub repository to the approved Cloudflare deployment workflow.
6. Apply checked-in migrations explicitly before enabling editor writes.
7. Configure the approved domain, DNS, TLS, cache rules, logs and usage visibility.

No account, domain, external deployment, paid service or GitHub deployment configuration is created by this repository foundation.

## Content safety

The local seed and visible UI placeholders are not official INPA content. They are labelled as development material, and production launch remains blocked until the items in [`CONTENT_READINESS.md`](./CONTENT_READINESS.md) are verified.
