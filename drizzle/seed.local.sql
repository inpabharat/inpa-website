-- Local development fixtures only. Every row is explicitly labelled as a development placeholder.
-- Never apply this file to a remote database.

INSERT OR IGNORE INTO news (
  id, slug, title, summary, body, category, status, is_featured,
  publish_at, published_at, created_at, updated_at, created_by, updated_by
) VALUES (
  '10000000-0000-4000-8000-000000000001',
  'development-placeholder-news',
  'Development placeholder: verified INPA news required',
  'This local-only record demonstrates the news-card layout. It is not an official INPA announcement.',
  'Development placeholder only. Replace this record with verified, editor-approved content before any launch.',
  'Development placeholder',
  'published',
  1,
  '2026-01-01T00:00:00.000Z',
  '2026-01-01T00:00:00.000Z',
  '2026-01-01T00:00:00.000Z',
  '2026-01-01T00:00:00.000Z',
  'local-development-seed',
  'local-development-seed'
);

INSERT OR IGNORE INTO events (
  id, slug, title, summary, body, start_at, timezone, location_name,
  is_online, status, is_featured, publish_at, created_at, updated_at, created_by, updated_by
) VALUES (
  '20000000-0000-4000-8000-000000000001',
  'development-placeholder-event',
  'Development placeholder: verified event required',
  'This local-only record demonstrates the event timeline. It is not an official INPA event.',
  'Development placeholder only. Replace this record with a verified event before any launch.',
  '2099-01-15T04:30:00.000Z',
  'Asia/Kolkata',
  'Location awaiting verification',
  0,
  'published',
  1,
  '2026-01-01T00:00:00.000Z',
  '2026-01-01T00:00:00.000Z',
  '2026-01-01T00:00:00.000Z',
  'local-development-seed',
  'local-development-seed'
);

INSERT OR IGNORE INTO carousel_items (
  id, eyebrow, title, summary, image_key, image_alt, cta_label, cta_url,
  linked_content_type, sort_order, is_active, starts_at, ends_at,
  created_at, updated_at, created_by, updated_by
) VALUES (
  '30000000-0000-4000-8000-000000000001',
  'Development placeholder',
  'Approved panoramic scientific imagery required',
  'This local-only slide confirms the data path without presenting invented institutional material.',
  'development/placeholders/hero-image-required',
  'Development placeholder for an approved INPA scientific panorama',
  'Content readiness',
  '/contact',
  'custom',
  0,
  1,
  '2026-01-01T00:00:00.000Z',
  '2099-12-31T23:59:59.000Z',
  '2026-01-01T00:00:00.000Z',
  '2026-01-01T00:00:00.000Z',
  'local-development-seed',
  'local-development-seed'
);
