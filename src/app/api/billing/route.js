import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET ALL BILLING
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        b.id,
        p.name AS patient_name,
        d.name AS doctor_name,
        b.amount,
        b.status,
        b.created_at
      FROM billing b
      JOIN appointments a ON b.appointment_id = a.id
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      ORDER BY b.created_at DESC
    `);

    return NextResponse.json(result.rows);

  } catch (err) {
    return NextResponse.json({ error: err.message });
  }
}


// CREATE BILL (AUTO FROM APPOINTMENT)
export async function POST(req) {
  try {
    const { appointment_id } = await req.json();

    // 🔥 GET DOCTOR FEE
    const result = await pool.query(`
      SELECT d.fee
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.id = $1
    `, [appointment_id]);

    const fee = result.rows[0].fee;

    const bill = await pool.query(
      `INSERT INTO billing (appointment_id, amount)
       VALUES ($1, $2)
       RETURNING *`,
      [appointment_id, fee]
    );

    return NextResponse.json(bill.rows[0]);

  } catch (err) {
    return NextResponse.json({ error: err.message });
  }
}