import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER, password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME,
});

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT d.*,
        COUNT(DISTINCT dpa.patient_id) AS assigned_patients,
        COUNT(DISTINCT dl.id) FILTER (WHERE dl.status = 'Approved' AND dl.to_date >= CURRENT_DATE) AS on_leave
      FROM doctors d
      LEFT JOIN doctor_patient_assignments dpa ON dpa.doctor_id = d.id AND dpa.status = 'Active'
      LEFT JOIN doctor_leaves dl ON dl.doctor_id = d.id
      GROUP BY d.id
      ORDER BY d.name
    `);
    return Response.json(result.rows);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  const { name, specialization, phone, email, experience, fee, bio, qualification } = await req.json();
  try {
    const result = await pool.query(
      `INSERT INTO doctors (name, specialization, phone, email, experience, fee, bio, qualification, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'Active') RETURNING *`,
      [name, specialization, phone, email, experience, fee, bio, qualification]
    );
    // Auto-create Mon-Fri schedule for new doctor
    const doctorId = result.rows[0].id;
    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
    for (const day of days) {
      await pool.query(
        `INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, slot_duration_mins)
         VALUES ($1,$2,'09:00','17:00',30)`,
        [doctorId, day]
      );
    }
    return Response.json(result.rows[0], { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}