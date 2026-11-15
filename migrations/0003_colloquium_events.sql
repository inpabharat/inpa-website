ALTER TABLE `events` ADD `event_type` text DEFAULT 'general' NOT NULL;--> statement-breakpoint
ALTER TABLE `events` ADD `speaker` text;--> statement-breakpoint
ALTER TABLE `events` ADD `speaker_affiliation` text;--> statement-breakpoint
ALTER TABLE `events` ADD `seminar_label` text;--> statement-breakpoint
ALTER TABLE `events` ADD `poster_pdf_key` text;--> statement-breakpoint
CREATE INDEX `idx_events_type_start` ON `events` (`event_type`,`start_at`);
--> statement-breakpoint
INSERT INTO `events` (
  `id`, `slug`, `event_type`, `title`, `summary`, `body`, `start_at`, `timezone`, `status`,
  `speaker`, `speaker_affiliation`, `seminar_label`, `poster_pdf_key`,
  `created_at`, `updated_at`, `created_by`, `updated_by`
) VALUES
  (
    'inpa-colloquium-01-subhendu-rajbanshi', 'inpa-colloquium-01-subhendu-rajbanshi', 'colloquium',
    'Critical Point Symmetries in Atomic Nuclei: Experimental Evidences in Finite Many-Body Systems',
    'Inaugural seminar of the INPA Young Scientist Colloquium.',
    'Presented by Dr. Subhendu Rajbanshi of Presidency University, Kolkata.',
    '2026-06-26T11:30:00.000Z', 'Asia/Kolkata', 'completed',
    'Dr. Subhendu Rajbanshi', 'Presidency University, Kolkata', 'Inaugural seminar',
    '/documents/inpa-colloquium-01-subhendu-rajbanshi.pdf',
    '2026-06-26T11:30:00.000Z', '2026-06-26T11:30:00.000Z', 'repository-baseline', 'repository-baseline'
  ),
  (
    'inpa-colloquium-02-neelam-upadhyay', 'inpa-colloquium-02-neelam-upadhyay', 'colloquium',
    'Computational and AI-Driven Frameworks for Nuclear Reaction Modelling: Applications to Astrophysical Reaction Mechanisms',
    'Second seminar of the INPA Young Scientist Colloquium.',
    'Presented by Dr. Neelam J. Upadhyay of Amity University Maharashtra.',
    '2026-07-25T11:30:00.000Z', 'Asia/Kolkata', 'completed',
    'Dr. Neelam J. Upadhyay', 'Amity University Maharashtra', 'Second seminar',
    '/documents/inpa-colloquium-02-neelam-upadhyay.pdf',
    '2026-07-25T11:30:00.000Z', '2026-07-25T11:30:00.000Z', 'repository-baseline', 'repository-baseline'
  );
