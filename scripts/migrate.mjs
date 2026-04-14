import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'
import { join } from 'path'

if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is not set')
  process.exit(1)
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const db = drizzle(pool)

const migrationsFolder = join(process.cwd(), 'drizzle')

try {
  await migrate(db, { migrationsFolder })
  console.log('Migrations applied successfully.')
} finally {
  await pool.end()
}
