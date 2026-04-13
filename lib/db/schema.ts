import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const stores = pgTable('stores', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const blogs = pgTable('blogs', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  featuredImage: text('featured_image'),
  metaKeywords: text('meta_keywords'),
  featured: boolean('featured').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Coupon type: 'copy' = copy-to-clipboard, 'link' = direct link
export const coupons = pgTable('coupons', {
  id: serial('id').primaryKey(),
  storeId: integer('store_id')
    .notNull()
    .references(() => stores.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  type: text('type').notNull().$type<'copy' | 'link'>(),
  code: text('code'),       // for 'copy' type
  linkUrl: text('link_url'), // for 'link' type
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type Store = typeof stores.$inferSelect
export type Blog = typeof blogs.$inferSelect
export type Coupon = typeof coupons.$inferSelect
export type NewStore = typeof stores.$inferInsert
export type NewBlog = typeof blogs.$inferInsert
export type NewCoupon = typeof coupons.$inferInsert
