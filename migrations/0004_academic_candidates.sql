CREATE TABLE `academic_candidates` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`affiliation` text,
	`stage` text NOT NULL,
	`roles` text NOT NULL,
	`research` text NOT NULL,
	`availability` text,
	`summary` text NOT NULL,
	`cv_url` text NOT NULL,
	`consent_at` text NOT NULL,
	`created_at` text NOT NULL,
	`verified_at` text,
	`token_hash` text,
	`link_expires_at` text,
	`expires_at` text,
	`renewal_requested_at` text,
	`delete_after` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_candidates_email` ON `academic_candidates` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_candidates_token` ON `academic_candidates` (`token_hash`);--> statement-breakpoint
CREATE INDEX `idx_candidates_expiry` ON `academic_candidates` (`expires_at`,`id`);--> statement-breakpoint
CREATE INDEX `idx_candidates_retention` ON `academic_candidates` (`delete_after`);