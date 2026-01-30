import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/database/schema';

const connectionString = process.env.DATABASE_URL;
if (!connectionString?.trim()) {
  throw new Error(
    'DATABASE_URL is not set. Add DATABASE_URL to your .env file (e.g. from Neon: postgresql://user:pass@host/db?sslmode=require).'
  );
}

const sql = neon(connectionString.trim());
export const db = drizzle({ client: sql, schema: { ...schema } });