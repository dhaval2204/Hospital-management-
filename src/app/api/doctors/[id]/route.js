import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER, password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME,
});

export async function GET(req, context) {
  const { id } = await context.params;

  try {
    const doctorResult = await pool.query(
      'SELECT * FROM doctors WHERE id = $1', [id]
    );

    if (!doctorResult.rows[0]) {
      return Response.json({ error: 'Doctor not found' }, { status: 404 });
    }

    const [schedules, leaves, ratings, patients, appointments] = await Promise.all([

      pool.query(
        `SELECT * FROM doctor_schedules WHERE doctor_id = $1
         ORDER BY ARRAY_POSITION(
           ARRAY['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
           day_of_week
         )`,
        [id]
      ),

      pool.query(
        'SELECT * FROM doctor_leaves WHERE doctor_id = $1 ORDER BY from_date DESC',
        [id]
      ),

      pool.query(
        `SELECT dr.*, COALESCE(p.name, 'Anonymous') AS patient_name
         FROM doctor_ratings dr
         LEFT JOIN patients p ON p.id = dr.patient_id
         WHERE dr.doctor_id = $1 ORDER BY dr.created_at DESC`,
        [id]
      ),

      // ✅ FIXED — now includes patients from appointments too
      pool.query(
        `SELECT
           p.id                                        AS patient_id,
           p.name                                      AS patient_name,
           p.age,
           p.disease,
           p.phone,
           p.blood_group,
           dpa.id                                      AS assignment_id,
           COALESCE(dpa.status, 'Active')              AS status,
           COALESCE(dpa.notes, '')                     AS notes,
           COALESCE(dpa.assigned_date, a.latest_date)  AS assigned_date,
           a.appointment_count,
           a.latest_date                               AS latest_appointment_date,
           a.latest_status                             AS latest_appointment_status,
           a.latest_time                               AS latest_appointment_time
         FROM patients p
         LEFT JOIN doctor_patient_assignments dpa
           ON dpa.patient_id = p.id AND dpa.doctor_id = $1
         LEFT JOIN (
           SELECT
             patient_id,
             COUNT(*)                                  AS appointment_count,
             MAX(appointment_date)                     AS latest_date,
             MAX(appointment_time)                     AS latest_time,
             (ARRAY_AGG(status ORDER BY appointment_date DESC))[1] AS latest_status
           FROM appointments
           WHERE doctor_id = $1
           GROUP BY patient_id
         ) a ON a.patient_id = p.id
         WHERE dpa.doctor_id = $1 OR a.patient_id IS NOT NULL
         ORDER BY COALESCE(dpa.assigned_date, a.latest_date) DESC NULLS LAST`,
        [id]
      ),

      pool.query(
        `SELECT
           a.id, a.appointment_date, a.appointment_time, a.status, a.created_at,
           p.id AS patient_id, p.name AS patient_name, p.age, p.disease,
           b.amount, b.status AS billing_status
         FROM appointments a
         LEFT JOIN patients p ON a.patient_id = p.id
         LEFT JOIN billing  b ON b.appointment_id = a.id
         WHERE a.doctor_id = $1
         ORDER BY a.appointment_date DESC`,
        [id]
      ),
    ]);

    return Response.json({
      ...doctorResult.rows[0],
      schedules:    schedules.rows,
      leaves:       leaves.rows,
      ratings:      ratings.rows,
      patients:     patients.rows,    // ← now includes appointment-only patients
      appointments: appointments.rows,
    });

  } catch (err) {
    console.error('Doctor GET error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, context) {
  const { id } = await context.params;
  const { name, specialization, phone, email, experience, fee, bio, qualification, status } = await req.json();
  try {
    const result = await pool.query(
      `UPDATE doctors SET name=$1, specialization=$2, phone=$3, email=$4,
       experience=$5, fee=$6, bio=$7, qualification=$8, status=$9
       WHERE id=$10 RETURNING *`,
      [name, specialization, phone, email, experience, fee, bio, qualification, status, id]
    );
    return Response.json(result.rows[0]);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  const { id } = await context.params;
  try {
    await pool.query('DELETE FROM doctors WHERE id = $1', [id]);
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}