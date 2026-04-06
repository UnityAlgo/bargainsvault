---
name: BargainsVault project overview
description: Full-stack coupon/deal website built with Next.js 16, Drizzle ORM, PostgreSQL, Tailwind CSS v4
type: project
---

Full-stack app built and scaffolded. Stack: Next.js 16.2.1 (App Router), TypeScript, Tailwind CSS v4, Drizzle ORM, PostgreSQL, JWT auth via jose, bcryptjs for password hashing.

**Why:** User requested complete BargainsVault coupon website from scratch.

**How to apply:** When making changes, note Next.js 16 breaking changes: `params` and `searchParams` are Promises (must be awaited). Use standard typed interfaces like `{ params: Promise<{ slug: string }> }` for dynamic routes — NOT `PageProps<'/path'>` until after `next dev` generates types. Tailwind v4 uses `@import "tailwindcss"` not `@tailwind base/components/utilities`.

Key files:
- lib/db/schema.ts — tables: users, stores, blogs, coupons
- lib/auth.ts — JWT session helpers (createSession, getSession, deleteSession)
- lib/actions/ — server actions for auth, blogs, stores, coupons
- app/(public)/ — public routes with shared navbar/footer layout
- app/login/ — admin login (no auth group, standalone page)
- app/admin/ — admin panel (auth-guarded layout)
- scripts/seed-admin.ts — creates initial admin user

Database setup: npm run db:push, then npm run seed:admin
