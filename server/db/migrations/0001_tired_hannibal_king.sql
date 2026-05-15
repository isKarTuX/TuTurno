PRAGMA foreign_keys=OFF;--> statement-breakpoint
ALTER TABLE `turns` ADD COLUMN `document_id` text NOT NULL DEFAULT '';
--> statement-breakpoint
PRAGMA foreign_keys=ON;