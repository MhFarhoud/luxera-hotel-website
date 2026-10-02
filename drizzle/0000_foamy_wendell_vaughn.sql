CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`session` text NOT NULL,
	`event` text NOT NULL,
	`role` text NOT NULL,
	`module` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_events_session` ON `events` (`session`);--> statement-breakpoint
CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`idempotency` text NOT NULL,
	`name` text NOT NULL,
	`hotel` text NOT NULL,
	`role` text NOT NULL,
	`position` text NOT NULL,
	`phone` text NOT NULL,
	`email` text NOT NULL,
	`rooms` integer,
	`city` text NOT NULL,
	`notes` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` text NOT NULL,
	`consent` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `leads_idempotency_unique` ON `leads` (`idempotency`);--> statement-breakpoint
CREATE INDEX `idx_leads_created_at` ON `leads` (`created_at`);