CREATE TABLE `featured_research` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`summary` text NOT NULL,
	`body` text NOT NULL,
	`authors` text NOT NULL,
	`institutions` text NOT NULL,
	`journal` text NOT NULL,
	`doi` text NOT NULL,
	`image_key` text,
	`image_alt` text,
	`image_credit` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`is_featured` integer DEFAULT false NOT NULL,
	`published_at` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	CONSTRAINT "ck_featured_research_status" CHECK("featured_research"."status" in ('draft','published','archived')),
	CONSTRAINT "ck_featured_research_image" CHECK(("featured_research"."image_key" is null and "featured_research"."image_alt" is null and "featured_research"."image_credit" is null) or ("featured_research"."image_key" is not null and length(trim("featured_research"."image_alt")) > 0 and length(trim("featured_research"."image_credit")) > 0))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_featured_research_slug` ON `featured_research` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_featured_research_public` ON `featured_research` (`status`,`is_featured`,`published_at`);--> statement-breakpoint
CREATE TABLE `publications` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`volume` integer NOT NULL,
	`issue_number` integer NOT NULL,
	`issue_label` text NOT NULL,
	`publication_date` text NOT NULL,
	`summary` text NOT NULL,
	`editorial` text NOT NULL,
	`featured_review` text NOT NULL,
	`pdf_key` text NOT NULL,
	`cover_image_key` text NOT NULL,
	`cover_image_alt` text NOT NULL,
	`page_count` integer NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	CONSTRAINT "ck_publications_status" CHECK("publications"."status" in ('draft','published','archived')),
	CONSTRAINT "ck_publications_numbers" CHECK("publications"."volume" > 0 and "publications"."issue_number" > 0 and "publications"."page_count" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_publications_slug` ON `publications` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `uq_publications_volume_issue` ON `publications` (`volume`,`issue_number`);--> statement-breakpoint
CREATE INDEX `idx_publications_public` ON `publications` (`status`,`publication_date`);