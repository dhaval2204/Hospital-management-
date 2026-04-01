import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER, password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME,
});

export async function GET(req, context) {
  const { id } = await context.params;
  try {
    const result = await pool.query(
      `SELECT * FROM doctor_schedules WHERE doctor_id = $1
       ORDER BY ARRAY_POSITION(
         ARRAY['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
         day_of_week
       )`,
      [id]
    );
    return Response.json(result.rows);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req, context) {
  const { id } = await context.params;
  const schedules = await req.json();
  try {
    await pool.query('DELETE FROM doctor_schedules WHERE doctor_id = $1', [id]);
    for (const s of schedules) {
      await pool.query(
        `INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, slot_duration_mins, is_available)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [id, s.day_of_week, s.start_time, s.end_time, s.slot_duration_mins || 30, s.is_available]
      );
    }
    const result = await pool.query(
      'SELECT * FROM doctor_schedules WHERE doctor_id = $1', [id]
    );
    return Response.json(result.rows);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}