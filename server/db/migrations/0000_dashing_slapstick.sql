CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`full_name` text NOT NULL,
	`document_id` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'citizen' NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_document_id_unique` ON `users` (`document_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `refresh_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`expires_at` integer NOT NULL,
	`user_agent` text,
	`created_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `refresh_sessions_token_unique` ON `refresh_sessions` (`token`);--> statement-breakpoint
CREATE TABLE `entities` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`address` text NOT NULL,
	`city` text NOT NULL,
	`latitude` real,
	`longitude` real,
	`phone` text,
	`email` text,
	`logo_url` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` text PRIMARY KEY NOT NULL,
	`entity_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`avg_attention_time` integer DEFAULT 5 NOT NULL,
	`open_time` text DEFAULT '08:00' NOT NULL,
	`close_time` text DEFAULT '17:00' NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`is_paused` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`entity_id`) REFERENCES `entities`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `operators` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`service_id` text NOT NULL,
	`entity_id` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`entity_id`) REFERENCES `entities`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `turns` (
	`id` text PRIMARY KEY NOT NULL,
	`turn_number` text NOT NULL,
	`citizen_id` text NOT NULL,
	`service_id` text NOT NULL,
	`entity_id` text NOT NULL,
	`status` text DEFAULT 'waiting' NOT NULL,
	`queue_position` integer NOT NULL,
	`notified_at` integer,
	`called_at` integer,
	`completed_at` integer,
	`created_at` integer,
	FOREIGN KEY (`citizen_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`entity_id`) REFERENCES `entities`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `push_subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`endpoint` text NOT NULL,
	`p256dh` text NOT NULL,
	`auth` text NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
