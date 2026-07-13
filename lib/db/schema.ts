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
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const blogCategories = pgTable('blog_categories', {
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
  categoryId: integer('category_id').references(() => blogCategories.id, { onDelete: 'set null' }),
  publishedAt: timestamp('published_at'),
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
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const carouselImages = pgTable('carousel_images', {
  id: serial('id').primaryKey(),
  imageUrl: text('image_url').notNull(),
  mobileImageUrl: text('mobile_image_url'),
  title: text('title'),
  linkUrl: text('link_url'),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  imageUrl: text('image_url'),
  price: text('price').notNull(),
  linkUrl: text('link_url'),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
})

export type User = typeof users.$inferSelect
export type Store = typeof stores.$inferSelect
export type BlogCategory = typeof blogCategories.$inferSelect
export type Blog = typeof blogs.$inferSelect
export type Coupon = typeof coupons.$inferSelect
export type CarouselImage = typeof carouselImages.$inferSelect
export type Product = typeof products.$inferSelect
export type NewStore = typeof stores.$inferInsert
export type NewBlog = typeof blogs.$inferInsert
export type NewCoupon = typeof coupons.$inferInsert
export type NewCarouselImage = typeof carouselImages.$inferInsert
export type NewProduct = typeof products.$inferInsert
export type Setting = typeof settings.$inferSelect
