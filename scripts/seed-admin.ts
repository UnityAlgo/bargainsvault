import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { users } from '../lib/db/schema'

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@bargainsvault.com'
  const password = process.env.ADMIN_PASSWORD || 'admin123'

  const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
  const db = drizzle(pool)

  const passwordHash = await bcrypt.hash(password, 12)

  await db.insert(users).values({ email, passwordHash })

  console.log(`Admin user created: ${email}`)
  await pool.end()
}

main().catch(console.error)
