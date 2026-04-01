// import { Pool } from "pg";

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

// export default pool;

import { Pool } from 'pg';

let pool;

function getPool() {
  if (pool) return pool;

  // If a full connection URL is provided (Neon, Supabase, Railway, etc.)
  if (process.env.DATABASE_URL) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false, // Required for Neon/Supabase
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  } else {
    // Individual env vars (local development)
    pool = new Pool({
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host:     process.env.DB_HOST,
      port:     parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME,
      // Only use SSL in production with individual vars
      ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
    });
  }

  // Log connection errors
  pool.on('error', (err) => {
    console.error('Database pool error:', err.message);
  });

  return pool;
}

export default getPool();