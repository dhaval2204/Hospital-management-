import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER, password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME,
});

export async function GET(req, context) {
  const { id } = await context.params;
  try {
    const result = await pool.query(
      'SELECT * FROM doctor_leaves WHERE doctor_id = $1 ORDER BY from_date DESC', [id]
    );
    return Response.json(result.rows);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req, context) {
  const { id } = await context.params;
  const { from_date, to_date, reason, status } = await req.json();
  try {
    const result = await pool.query(
      `INSERT INTO doctor_leaves (doctor_id, from_date, to_date, reason, status)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [id, from_date, to_date, reason, status || 'Pending']
    );
    return Response.json(result.rows[0], { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req, context) {
  const { id } = await context.params;
  const { leave_id, status } = await req.json();
  try {
    const result = await pool.query(
      'UPDATE doctor_leaves SET status=$1 WHERE id=$2 AND doctor_id=$3 RETURNING *',
      [status, leave_id, id]
    );
    return Response.json(result.rows[0]);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}