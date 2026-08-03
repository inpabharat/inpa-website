-- Local development fixtures sourced from supplied Nuclear Horizons issues.
-- Never apply this file to a remote database. Re-running it replaces only local-development seed rows.

DELETE FROM news WHERE created_by = 'local-development-seed';
DELETE FROM events WHERE created_by = 'local-development-seed';
DELETE FROM carousel_items WHERE created_by = 'local-development-seed';

INSERT INTO news (
  id, slug, title, summary, body, category, status, is_featured,
  publish_at, published_at, created_at, updated_at, created_by, updated_by
) VALUES (
  '10000000-0000-4000-8000-000000000001',
  'inpa-registered-scientific-society',
  'INPA registered as a scientific society',
  'Nuclear Horizons reports that INPA received its certificate of registration on 2 May 2026.',
  'The June 2026 issue of Nuclear Horizons reports that the Indian Nuclear Physics Association received its certificate of registration as a society on 2 May 2026. The published registration number is VAR/00818/2026-27. This local website summary is sourced from Nuclear Horizons, Volume 1, Issue 2.',
  'Institutional update',
  'published',
  1,
  '2026-08-02T00:00:00.000+05:30',
  '2026-08-02T00:00:00.000+05:30',
  '2026-08-02T00:00:00.000+05:30',
  '2026-08-02T00:00:00.000+05:30',
  'local-development-seed',
  'local-development-seed'
);

INSERT INTO news (
  id, slug, title, summary, body, category, status, is_featured,
  publish_at, published_at, created_at, updated_at, created_by, updated_by
) VALUES (
  '10000000-0000-4000-8000-000000000002',
  'nuclear-horizons-volume-1-issue-2',
  'Nuclear Horizons Volume 1, Issue 2 published',
  'The June 2026 issue presents INPA updates, perspectives, feature articles, laboratory highlights and young-researcher contributions.',
  'Nuclear Horizons, the official bulletin of the Indian Nuclear Physics Association, published Volume 1, Issue 2 in June 2026. The supplied issue identifies Dr. Soumya Bagchi of IIT (ISM) Dhanbad as Chief Editor. Download access is withheld locally until web-distribution permission is confirmed.',
  'Nuclear Horizons',
  'published',
  1,
  '2026-08-02T00:00:00.000+05:30',
  '2026-08-02T00:00:00.000+05:30',
  '2026-08-02T00:00:00.000+05:30',
  '2026-08-02T00:00:00.000+05:30',
  'local-development-seed',
  'local-development-seed'
);

INSERT INTO carousel_items (
  id, eyebrow, title, summary, image_key, image_alt, cta_label, cta_url,
  linked_content_type, sort_order, is_active, starts_at, ends_at,
  created_at, updated_at, created_by, updated_by
) VALUES (
  '30000000-0000-4000-8000-000000000001',
  'Nuclear Horizons · June 2026',
  'Volume 1, Issue 2',
  'Explore verified issue metadata and the bulletin’s role in connecting India’s nuclear-physics community.',
  'development/permission-pending/nuclear-horizons-cover',
  'Text-only Nuclear Horizons feature; official cover permission is pending',
  'Issue information',
  '/nuclear-horizons',
  'custom',
  0,
  1,
  NULL,
  NULL,
  '2026-08-02T00:00:00.000+05:30',
  '2026-08-02T00:00:00.000+05:30',
  'local-development-seed',
  'local-development-seed'
), (
  '30000000-0000-4000-8000-000000000002',
  'Institutional milestone',
  'INPA registered as a scientific society',
  'The association received its certificate of registration on 2 May 2026.',
  'development/text-only/inpa-registration',
  'Text-only feature announcing INPA registration; no supplied image is republished',
  'About INPA',
  '/about',
  'custom',
  1,
  1,
  NULL,
  NULL,
  '2026-08-02T00:00:00.000+05:30',
  '2026-08-02T00:00:00.000+05:30',
  'local-development-seed',
  'local-development-seed'
);
