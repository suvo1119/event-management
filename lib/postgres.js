import { Pool } from 'pg';

let pool = null;

export function getPostgresPool() {
  if (!pool && process.env.DATABASE_URL) {
    try {
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL.includes('sslmode=require') || process.env.DATABASE_URL.includes('supabase')
          ? { rejectUnauthorized: false }
          : false,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000
      });
    } catch (err) {
      console.warn('Postgres connection pool initialization warning:', err.message);
    }
  }
  return pool;
}

export async function queryPostgres(text, params = []) {
  const p = getPostgresPool();
  if (!p) throw new Error('DATABASE_URL not configured');
  return await p.query(text, params);
}
