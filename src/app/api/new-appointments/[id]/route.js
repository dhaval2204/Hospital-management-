import { NextResponse } from "next/server";
import pool from "@/lib/db";

// 🔥 GET APPOINTMENTS FOR SPECIFIC DOCTOR
export async function GET(req, context) {
  try {
    const params = await context.params;
    const doctorId = parseInt(params.id);

    const result = await pool.query(`
      SELECT 
        a.id,
        p.name AS patient_name,
        a.appointment_date,
        a.status
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      WHERE a.doctor_id = $1
      ORDER BY a.appointment_date DESC
    `, [doctorId]);

    return NextResponse.json(result.rows);

  } catch (error) {
    console.error("GET DOCTOR ERROR 👉", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// 🔥 UPDATE APPOINTMENT (status change etc.)
export async function PUT(req, context) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);

    const body = await req.json();
    const { status } = body;

    const result = await pool.query(
      `UPDATE appointments
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    return NextResponse.json(result.rows[0]);

  } catch (error) {
    console.error("UPDATE ERROR 👉", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// 🔥 DELETE APPOINTMENT
export async function DELETE(req, context) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);

    await pool.query("DELETE FROM appointments WHERE id = $1", [id]);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("DELETE ERROR 👉", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}