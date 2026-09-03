# Deployment and rollback

## Environment model

- GitHub pushes currently deploy the separate `inpa-website-preview` Worker automatically.
- `inpa-website` is production and remains manual until the release process and primary domain are approved.
- D1 and R2 resources are separate in preview and production.

The preview Worker and production Worker do not share version histories, so a version cannot be promoted directly from one Worker to the other.

## Manual production candidate with a Cloudflare click

From a clean, reviewed `main` checkout:

```powershell
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test
pnpm upload:production
```

The last command uploads the same built application as a non-live version of `inpa-website`. To activate it:

1. Open Cloudflare **Workers & Pages**.
2. Select **inpa-website**, not `inpa-website-preview`.
3. Open **Deployments**.
4. Locate the newly uploaded version and inspect its timestamp/version identifier.
5. Select **Promote deployment**.
6. Choose that version at 100% traffic and confirm.
7. Smoke-test the homepage, news, events, media, sitemap, and the protected editor boundary.

The direct alternative is `pnpm deploy:production`; it uploads and activates immediately, so there is no dashboard promotion step.

## Database changes

Migrations are never automatic. Apply and verify them in preview first. Run `pnpm db:migrate:production` only for a reviewed checked-in migration and only after confirming the application version is compatible with both the old and new schema. Never run the local seed against a remote database.

## Rollback

In Cloudflare, open **Workers & Pages → inpa-website → Deployments**, choose the last known-good deployment, and roll back. The command-line equivalent is:

```powershell
pnpm exec wrangler rollback --config wrangler.jsonc --env production
```

Worker rollback does not revert D1 data or migrations. Use D1 Time Travel or a reviewed recovery migration for database recovery.
