# Foundation architecture

## Runtime surfaces

1. The public Nuxt site renders semantic HTML and uses cached read-only APIs.
2. `/api/public/**` reads only eligible published D1 records through the service and repository layers.
3. `/admin/**` and `/api/admin/**` share a server-enforced Cloudflare Access boundary and are never cached or indexed.

## Data flow

Nuxt route handler → public-content service → public-content repository → Drizzle D1 adapter → `DB` binding.

The binding adapter is the only layer that knows about Nitro's Cloudflare event context. When no D1 binding exists, public services return explicit empty states instead of leaking infrastructure errors.

R2 is exposed through the `MEDIA` binding adapter, but upload and delivery endpoints are deliberately deferred until the editor workflow is implemented. D1 stores only media keys and metadata; R2 will store binary data.

## Rendering and cache boundary

- Stable institutional routes are configured for prerendering.
- Public database APIs emit shared-cache directives with stale-while-revalidate support.
- The homepage may be stale-while-revalidated for a short interval.
- Editor routes are server-rendered, protected and marked `noindex, nofollow, noarchive`.
- The initial sitemap contains only the homepage because all other repository-managed routes still contain unverified placeholders.

## Authentication rule

Cloudflare Access is authentication and the explicit Access policy is the editor allowlist. The application still validates each `Cf-Access-Jwt-Assertion` signature, issuer and application audience with Cloudflare's rotating public keys. Missing configuration or claims are denied.

The local bypass is accepted only when both conditions hold:

1. Nuxt compiled the running process in development mode.
2. `NUXT_DEV_AUTH_BYPASS=true` was deliberately set.

A production build therefore fails closed even if someone accidentally sets the bypass variable.

## Migration policy

Migrations are checked in and applied explicitly. Local and remote commands are separate. Production schema changes are not run at application startup. Before a future remote migration, export the database or confirm D1 Time Travel, apply in preview, and document the forward-fix or rollback path for the specific change.
