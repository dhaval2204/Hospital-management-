import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET ALL APPOINTMENTS
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        a.id,
        p.name AS patient_name,
        d.name AS doctor_name,
        a.appointment_date,
        a.status
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      ORDER BY a.appointment_date DESC
    `);

    return NextResponse.json(result.rows);

  } catch (error) {
    console.error("GET ERROR 👉", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// CREATE APPOINTMENT
export async function POST(req) {
  try {
    const body = await req.json();

    const { patient_id, doctor_id, appointment_date, status } = body;

    const result = await pool.query(
      `INSERT INTO appointments (patient_id, doctor_id, appointment_date, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [patient_id, doctor_id, appointment_date, status]
    );

    return NextResponse.json(result.rows[0]);

  } catch (error) {
    console.error("POST ERROR 👉", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}