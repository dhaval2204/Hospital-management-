import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER, password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME,
});

export async function GET(req, context) {
  const { id } = await context.params;
  const doctorId = parseInt(id);

  try {
    const result = await pool.query(
      `
      SELECT
        p.id                                          AS patient_id,
        p.name                                        AS patient_name,
        p.age,
        p.disease,
        p.phone,
        p.blood_group,

        -- Assignment info (may be null if patient only has appointment)
        dpa.id                                        AS assignment_id,
        COALESCE(dpa.status, 'Active')                AS status,
        COALESCE(dpa.notes, '')                       AS notes,
        COALESCE(dpa.assigned_date, a.latest_date)    AS assigned_date,

        -- Appointment info
        a.appointment_count,
        a.latest_date                                 AS latest_appointment_date,
        a.latest_status                               AS latest_appointment_status,
        a.latest_time                                 AS latest_appointment_time

      FROM patients p

      -- Patients explicitly assigned to this doctor
      LEFT JOIN doctor_patient_assignments dpa
        ON dpa.patient_id = p.id AND dpa.doctor_id = $1

      -- Patients who have ANY appointment with this doctor
      LEFT JOIN (
        SELECT
          patient_id,
          COUNT(*)                                    AS appointment_count,
          MAX(appointment_date)                       AS latest_date,
          MAX(appointment_time)                       AS latest_time,
          (ARRAY_AGG(status ORDER BY appointment_date DESC))[1] AS latest_status
        FROM appointments
        WHERE doctor_id = $1
        GROUP BY patient_id
      ) a ON a.patient_id = p.id

      -- Only include patients who are assigned OR have an appointment
      WHERE dpa.doctor_id = $1
         OR a.patient_id  IS NOT NULL

      ORDER BY COALESCE(dpa.assigned_date, a.latest_date) DESC NULLS LAST
      `,
      [doctorId]
    );

    return Response.json(result.rows);

  } catch (err) {
    console.error('GET doctor patients error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req, context) {
  const { id } = await context.params;
  const doctorId = parseInt(id);

  try {
    const body = await req.json();
    const patientId = parseInt(body.patient_id);
    const notes = body.notes || null;

    if (!doctorId || !patientId || isNaN(patientId)) {
      return Response.json({ error: 'Invalid doctor_id or patient_id' }, { status: 400 });
    }

    // Upsert assignment
    const assign = await pool.query(
      `INSERT INTO doctor_patient_assignments (doctor_id, patient_id, notes, status)
       VALUES ($1, $2, $3, 'Active')
       ON CONFLICT (doctor_id, patient_id)
       DO UPDATE SET status = 'Active', notes = $3
       RETURNING *`,
      [doctorId, patientId, notes]
    );

    // Create appointment only if none exists for today or future
    await pool.query(
      `INSERT INTO appointments (patient_id, doctor_id, appointment_date, status)
       SELECT $1, $2, CURRENT_DATE, 'Pending'
       WHERE NOT EXISTS (
         SELECT 1 FROM appointments
         WHERE patient_id = $1
           AND doctor_id  = $2
           AND appointment_date >= CURRENT_DATE
           AND status NOT IN ('Cancelled')
       )`,
      [patientId, doctorId]
    );

    return Response.json(assign.rows[0]);

  } catch (err) {
    console.error('POST doctor patients error:', err.message);
    return Response.json({ error: err.message, detail: err.detail, code: err.code }, { status: 500 });
  }
}

export async function PATCH(req, context) {
  const { id } = await context.params;
  const doctorId = parseInt(id);
  const { assignment_id, status } = await req.json();

  try {
    // If discharging via assignment
    if (assignment_id) {
      const result = await pool.query(
        'UPDATE doctor_patient_assignments SET status=$1 WHERE id=$2 AND doctor_id=$3 RETURNING *',
        [status, assignment_id, doctorId]
      );
      return Response.json(result.rows[0]);
    }

    return Response.json({ error: 'assignment_id required' }, { status: 400 });

  } catch (err) {
    console.error('PATCH doctor patients error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}