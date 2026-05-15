PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_turns` (
	`id` text PRIMARY KEY NOT NULL,
	`turn_number` text NOT NULL,
	`citizen_id` text,
	`service_id` text NOT NULL,
	`entity_id` text NOT NULL,
	`document_id` text,
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
INSERT INTO `__new_turns`("id", "turn_number", "citizen_id", "service_id", "entity_id", "document_id", "status", "queue_position", "notified_at", "called_at", "completed_at", "created_at") SELECT "id", "turn_number", "citizen_id", "service_id", "entity_id", "document_id", "status", "queue_position", "notified_at", "called_at", "completed_at", "created_at" FROM `turns`;--> statement-breakpoint
DROP TABLE `turns`;--> statement-breakpoint
ALTER TABLE `__new_turns` RENAME TO `turns`;--> statement-breakpoint
PRAGMA foreign_keys=ON;