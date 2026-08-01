CREATE TABLE `news` (
  `id` text PRIMARY KEY NOT NULL,
  `slug` text NOT NULL,
  `title` text NOT NULL,
  `summary` text NOT NULL,
  `body` text NOT NULL,
  `cover_image_key` text,
  `cover_image_alt` text,
  `category` text,
  `status` text DEFAULT 'draft' NOT NULL,
  `is_featured` integer DEFAULT 0 NOT NULL,
  `publish_at` text,
  `published_at` text,
  `expires_at` text,
  `external_url` text,
  `created_at` text NOT NULL,
  `updated_at` text NOT NULL,
  `created_by` text NOT NULL,
  `updated_by` text NOT NULL,
  CONSTRAINT `ck_news_status` CHECK (`status` in ('draft','scheduled','published','archived')),
  CONSTRAINT `ck_news_cover_alt` CHECK ((`cover_image_key` is null and `cover_image_alt` is null) or (`cover_image_key` is not null and length(trim(`cover_image_alt`)) > 0))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_news_slug` ON `news` (`slug`);
--> statement-breakpoint
CREATE INDEX `idx_news_publication` ON `news` (`status`,`published_at`,`expires_at`);
--> statement-breakpoint
CREATE INDEX `idx_news_featured` ON `news` (`is_featured`,`published_at`);
--> statement-breakpoint
CREATE TABLE `events` (
  `id` text PRIMARY KEY NOT NULL,
  `slug` text NOT NULL,
  `title` text NOT NULL,
  `summary` text NOT NULL,
  `body` text NOT NULL,
  `start_at` text NOT NULL,
  `end_at` text,
  `timezone` text DEFAULT 'Asia/Kolkata' NOT NULL,
  `location_name` text,
  `is_online` integer DEFAULT 0 NOT NULL,
  `external_url` text,
  `cover_image_key` text,
  `cover_image_alt` text,
  `status` text DEFAULT 'draft' NOT NULL,
  `is_featured` integer DEFAULT 0 NOT NULL,
  `publish_at` text,
  `created_at` text NOT NULL,
  `updated_at` text NOT NULL,
  `created_by` text NOT NULL,
  `updated_by` text NOT NULL,
  CONSTRAINT `ck_events_status` CHECK (`status` in ('draft','scheduled','published','postponed','cancelled','completed','archived')),
  CONSTRAINT `ck_events_dates` CHECK (`end_at` is null or `end_at` >= `start_at`),
  CONSTRAINT `ck_events_cover_alt` CHECK ((`cover_image_key` is null and `cover_image_alt` is null) or (`cover_image_key` is not null and length(trim(`cover_image_alt`)) > 0))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_events_slug` ON `events` (`slug`);
--> statement-breakpoint
CREATE INDEX `idx_events_upcoming` ON `events` (`status`,`start_at`);
--> statement-breakpoint
CREATE INDEX `idx_events_publication` ON `events` (`status`,`publish_at`);
--> statement-breakpoint
CREATE TABLE `carousel_items` (
  `id` text PRIMARY KEY NOT NULL,
  `eyebrow` text,
  `title` text NOT NULL,
  `summary` text,
  `image_key` text NOT NULL,
  `image_alt` text NOT NULL,
  `cta_label` text,
  `cta_url` text,
  `linked_content_type` text,
  `linked_content_id` text,
  `sort_order` integer DEFAULT 0 NOT NULL,
  `is_active` integer DEFAULT 0 NOT NULL,
  `starts_at` text,
  `ends_at` text,
  `created_at` text NOT NULL,
  `updated_at` text NOT NULL,
  `created_by` text NOT NULL,
  `updated_by` text NOT NULL,
  CONSTRAINT `ck_carousel_linked_type` CHECK (`linked_content_type` is null or `linked_content_type` in ('news','event','custom')),
  CONSTRAINT `ck_carousel_schedule` CHECK (`ends_at` is null or `starts_at` is null or `ends_at` >= `starts_at`),
  CONSTRAINT `ck_carousel_image_alt` CHECK (length(trim(`image_alt`)) > 0)
);
--> statement-breakpoint
CREATE INDEX `idx_carousel_active_order` ON `carousel_items` (`is_active`,`sort_order`);
--> statement-breakpoint
CREATE TABLE `content_revisions` (
  `id` text PRIMARY KEY NOT NULL,
  `entity_type` text NOT NULL,
  `entity_id` text NOT NULL,
  `action` text NOT NULL,
  `editor_identity` text NOT NULL,
  `previous_value` text,
  `new_value` text,
  `created_at` text NOT NULL,
  CONSTRAINT `ck_revisions_previous_json` CHECK (`previous_value` is null or json_valid(`previous_value`)),
  CONSTRAINT `ck_revisions_new_json` CHECK (`new_value` is null or json_valid(`new_value`))
);
--> statement-breakpoint
CREATE INDEX `idx_revisions_entity` ON `content_revisions` (`entity_type`,`entity_id`,`created_at`);
--> statement-breakpoint
PRAGMA optimize;
