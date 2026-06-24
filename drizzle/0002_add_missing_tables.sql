CREATE TABLE "carousel_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"image_url" text NOT NULL,
	"title" text,
	"link_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"image_url" text,
	"price" text NOT NULL,
	"link_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "coupons" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;
