import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

export async function GET(req, context) {
  try {
    const params = await context.params;
    const patientId = parseInt(params.id);

    console.log("GET PARAM ID:", params.id);
    console.log("GET PARSED ID:", patientId);

    if (!patientId || isNaN(patientId)) {
      return Response.json({ error: "Invalid patient ID" }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT * FROM patient_history 
       WHERE patient_id = $1 
       ORDER BY visit_date DESC`,
      [patientId]
    );

    return Response.json(result.rows);

  } catch (err) {
    console.error('History fetch error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
export async function POST(req, context) {
  try {
    const params = await context.params;   // ✅ FIX
    const patientId = parseInt(params.id); // ✅ FIX

    console.log("PARAM ID:", params.id);
    console.log("PARSED ID:", patientId);

    if (!patientId || isNaN(patientId)) {
      return Response.json({ error: "Invalid patient ID" }, { status: 400 });
    }

    const { diagnosis, treatment, doctor_name, visit_date, notes } = await req.json();

    const result = await pool.query(
      `INSERT INTO patient_history 
       (patient_id, diagnosis, treatment, doctor_name, visit_date, notes)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [patientId, diagnosis, treatment, doctor_name, visit_date, notes]
    );

    return Response.json(result.rows[0], { status: 201 });

  } catch (err) {
    console.error("HISTORY ERROR:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}