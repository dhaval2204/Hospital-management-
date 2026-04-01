import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req, context) {
  try {
    const { id } = await context.params;
    const appointmentId = parseInt(id);

    const result = await pool.query(
      `SELECT
         a.id, a.appointment_date, a.appointment_time, a.status, a.notes, a.created_at,
         a.patient_id, a.doctor_id,
         p.name  AS patient_name,  p.age,        p.disease,
         p.phone AS patient_phone, p.email AS patient_email,
         p.blood_group,            p.gender,      p.address,
         d.name  AS doctor_name,   d.specialization,
         d.phone AS doctor_phone,  d.email AS doctor_email,
         d.fee,                    d.qualification, d.experience,
         b.id    AS billing_id,    b.amount,      b.status AS billing_status,
         b.created_at AS billed_at
       FROM appointments a
       LEFT JOIN patients p ON p.id = a.patient_id
       LEFT JOIN doctors  d ON d.id = a.doctor_id
       LEFT JOIN billing  b ON b.appointment_id = a.id
       WHERE a.id = $1`,
      [appointmentId]
    );

    if (!result.rows[0]) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    const appt = result.rows[0];

    const history = await pool.query(
      `SELECT diagnosis, treatment, doctor_name, visit_date, notes
       FROM patient_history
       WHERE patient_id = $1
       ORDER BY visit_date DESC`,
      [appt.patient_id]
    );

    const prevAppts = await pool.query(
      `SELECT id, appointment_date, appointment_time, status, notes
       FROM appointments
       WHERE patient_id = $1 AND doctor_id = $2 AND id != $3
       ORDER BY appointment_date DESC LIMIT 4`,
      [appt.patient_id, appt.doctor_id, appointmentId]
    );

    return NextResponse.json({
      ...appt,
      patient_history: history.rows,
      previous_appointments: prevAppts.rows,
    });

  } catch (err) {
    console.error('GET appointment error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    const { id } = await context.params;
    const appointmentId = parseInt(id);
    const body = await req.json();

    const {
      patient_id, doctor_id, appointment_date,
      appointment_time, status, notes,
    } = body;

    // ── PARTIAL UPDATE (from calendar drag-drop or status-only change) ──────
    // Detected when the body has only a subset of fields (e.g. just status,
    // or just appointment_date + appointment_time from drag-drop).
    // Full update requires patient_id to be present.
    const isPartial = patient_id === undefined;

    if (isPartial) {
      // Build SET clause dynamically from only the fields provided
      const allowed = [
        'appointment_date', 'appointment_time',
        'status', 'notes', 'patient_id', 'doctor_id', 'slot_duration_mins',
      ];
      const fields = Object.keys(body).filter(k => allowed.includes(k));

      if (fields.length === 0) {
        return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
      }

      // Conflict check for drag-drop reschedule
      if (body.appointment_time !== undefined && body.appointment_date !== undefined) {
        // Need the doctor_id — fetch from DB if not provided in body
        let doctorId = body.doctor_id;
        if (!doctorId) {
          const cur = await pool.query(
            'SELECT doctor_id FROM appointments WHERE id=$1', [appointmentId]
          );
          doctorId = cur.rows[0]?.doctor_id;
        }
        if (doctorId && body.appointment_time) {
          const conflict = await pool.query(
            `SELECT id FROM appointments
             WHERE doctor_id=$1 AND appointment_date=$2
               AND appointment_time=$3 AND status NOT IN ('Cancelled') AND id != $4`,
            [doctorId, body.appointment_date, body.appointment_time, appointmentId]
          );
          if (conflict.rows.length > 0) {
            return NextResponse.json({ error: 'This time slot is already booked' }, { status: 409 });
          }
        }
      }

      const setClauses = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
      const values = [...fields.map(f => body[f]), appointmentId];

      await pool.query(
        `UPDATE appointments SET ${setClauses} WHERE id = $${values.length}`,
        values
      );

      // Auto-bill if status changed to Completed
      if (body.status === 'Completed') {
        const exists = await pool.query(
          'SELECT id FROM billing WHERE appointment_id=$1', [appointmentId]
        );
        if (exists.rows.length === 0) {
          const fee = await pool.query(
            `SELECT d.fee FROM appointments a JOIN doctors d ON a.doctor_id=d.id WHERE a.id=$1`,
            [appointmentId]
          );
          await pool.query(
            `INSERT INTO billing (appointment_id, amount, status) VALUES ($1,$2,'Pending')`,
            [appointmentId, fee.rows[0]?.fee || 0]
          );
        }
      }

      return NextResponse.json({ success: true });
    }

    // ── FULL UPDATE (from appointment form edit) ─────────────────────────────
    if (appointment_time) {
      const conflict = await pool.query(
        `SELECT id FROM appointments
         WHERE doctor_id=$1 AND appointment_date=$2
           AND appointment_time=$3 AND status NOT IN ('Cancelled') AND id != $4`,
        [doctor_id, appointment_date, appointment_time, appointmentId]
      );
      if (conflict.rows.length > 0) {
        return NextResponse.json({ error: 'This time slot is already booked' }, { status: 409 });
      }
    }

    await pool.query(
      `UPDATE appointments
       SET patient_id=$1, doctor_id=$2, appointment_date=$3,
           appointment_time=$4, status=$5, notes=$6
       WHERE id=$7`,
      [patient_id, doctor_id, appointment_date, appointment_time || null, status, notes || null, appointmentId]
    );

    // Auto-bill on Completed
    if (status === 'Completed') {
      const exists = await pool.query(
        'SELECT id FROM billing WHERE appointment_id=$1', [appointmentId]
      );
      if (exists.rows.length === 0) {
        const fee = await pool.query(
          `SELECT d.fee FROM appointments a JOIN doctors d ON a.doctor_id=d.id WHERE a.id=$1`,
          [appointmentId]
        );
        await pool.query(
          `INSERT INTO billing (appointment_id, amount, status) VALUES ($1,$2,'Pending')`,
          [appointmentId, fee.rows[0]?.fee || 0]
        );
      }
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('PUT appointment error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    const { id } = await context.params;
    await pool.query('DELETE FROM appointments WHERE id=$1', [parseInt(id)]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}