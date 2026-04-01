import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req, context) {
  try {
    const { id } = await context.params;
    const appointmentId = parseInt(id);

    if (!appointmentId || isNaN(appointmentId)) {
      return NextResponse.json({ error: "Invalid appointment ID" }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT
         a.id, a.appointment_date, a.appointment_time, a.status, a.notes, a.created_at,
         p.name  AS patient_name,  p.age,        p.disease,
         p.phone AS patient_phone, p.email AS patient_email,
         p.blood_group,            p.gender,      p.address,
         d.name  AS doctor_name,   d.specialization,
         d.phone AS doctor_phone,  d.email AS doctor_email,
         d.fee,                    d.qualification, d.experience,
         b.amount,                 b.status AS billing_status
       FROM appointments a
       LEFT JOIN patients p ON p.id = a.patient_id
       LEFT JOIN doctors  d ON d.id = a.doctor_id
       LEFT JOIN billing  b ON b.appointment_id = a.id
       WHERE a.id = $1`,
      [appointmentId]
    );

    if (!result.rows[0]) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);

  } catch (err) {
    console.error("RECEIPT ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}