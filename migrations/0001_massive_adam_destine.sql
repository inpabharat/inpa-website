CREATE TABLE `landscape_facilities` (
	`id` text PRIMARY KEY NOT NULL,
	`institution_id` text NOT NULL,
	`name` text NOT NULL,
	`facility_type` text,
	`detector_systems` text,
	`capabilities` text,
	`is_user_facility` integer DEFAULT false NOT NULL,
	`official_url` text,
	`verification_status` text DEFAULT 'pending' NOT NULL,
	`last_verified` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	FOREIGN KEY (`institution_id`) REFERENCES `landscape_institutions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_landscape_facilities_institution` ON `landscape_facilities` (`institution_id`);--> statement-breakpoint
CREATE TABLE `landscape_institution_areas` (
	`institution_id` text NOT NULL,
	`research_area_id` text NOT NULL,
	FOREIGN KEY (`institution_id`) REFERENCES `landscape_institutions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`research_area_id`) REFERENCES `landscape_research_areas`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_landscape_institution_area` ON `landscape_institution_areas` (`institution_id`,`research_area_id`);--> statement-breakpoint
CREATE INDEX `idx_landscape_institution_areas_area` ON `landscape_institution_areas` (`research_area_id`);--> statement-breakpoint
CREATE TABLE `landscape_institutions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`department` text,
	`city` text NOT NULL,
	`state` text NOT NULL,
	`region` text NOT NULL,
	`institution_type` text NOT NULL,
	`character` text,
	`latitude_microdegrees` integer,
	`longitude_microdegrees` integer,
	`official_url` text,
	`description` text NOT NULL,
	`verification_status` text DEFAULT 'pending' NOT NULL,
	`source_profile` text,
	`last_verified` text,
	`editorial_notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_landscape_institutions_region_type` ON `landscape_institutions` (`region`,`institution_type`);--> statement-breakpoint
CREATE INDEX `idx_landscape_institutions_verification` ON `landscape_institutions` (`verification_status`,`last_verified`);--> statement-breakpoint
CREATE TABLE `landscape_research_areas` (
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_landscape_research_areas_label` ON `landscape_research_areas` (`label`);--> statement-breakpoint
CREATE TABLE `landscape_researcher_areas` (
	`researcher_id` text NOT NULL,
	`research_area_id` text NOT NULL,
	FOREIGN KEY (`researcher_id`) REFERENCES `landscape_researchers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`research_area_id`) REFERENCES `landscape_research_areas`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_landscape_researcher_area` ON `landscape_researcher_areas` (`researcher_id`,`research_area_id`);--> statement-breakpoint
CREATE INDEX `idx_landscape_researcher_areas_area` ON `landscape_researcher_areas` (`research_area_id`);--> statement-breakpoint
CREATE TABLE `landscape_researchers` (
	`id` text PRIMARY KEY NOT NULL,
	`institution_id` text NOT NULL,
	`name` text NOT NULL,
	`designation` text,
	`department` text,
	`character` text,
	`official_profile_url` text,
	`orcid` text,
	`verification_status` text DEFAULT 'pending' NOT NULL,
	`last_verified` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	FOREIGN KEY (`institution_id`) REFERENCES `landscape_institutions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_landscape_researchers_institution` ON `landscape_researchers` (`institution_id`);