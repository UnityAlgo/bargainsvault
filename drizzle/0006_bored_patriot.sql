CREATE TABLE "blog_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "blogs" ADD COLUMN "category_id" integer;--> statement-breakpoint
ALTER TABLE "blogs" ADD COLUMN "published_at" timestamp;--> statement-breakpoint
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_category_id_blog_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."blog_categories"("id") ON DELETE set null ON UPDATE no action;