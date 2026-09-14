# Editor-managed science publishing — 14 September 2026

The user explicitly expanded editor scope to Nuclear Horizons and featured research. These modules use D1 metadata and R2 files under the existing Access boundary. Institutional and map content remain repository-managed.

Writes are server-validated and stored atomically with audit revisions. GET requests never seed data. Existing publications form a repository baseline; edits create D1 overrides under stable IDs. Removal archives the override to prevent baseline resurrection. New entries have UUIDs. Slug and volume/issue uniqueness are enforced. Upload references must exist and match the expected MIME type.

Science pages are edge-rendered. Public responses omit editor metadata and exclude drafts, withdrawals and future items. Homepage/API freshness is bounded to 60 seconds without stale-while-revalidate. Public issue cards display month/year for the legacy month-only dates.

Migration `0002_awesome_red_hulk.sql` adds publications and featured_research. Apply locally, then preview, then production. Old application code ignores these tables, so application rollback can leave them intact. Do not drop them once editors publish. Rolling back hides new science content until the updated application returns. No new paid service is introduced.
