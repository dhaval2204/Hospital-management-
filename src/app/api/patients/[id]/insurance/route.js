import { NextResponse } from "next/server";
import pool from "@/lib/db";

// ✅ GET insurance for patient
export async function GET(req, context) {
  try {
    const params = await context.params;   // ✅ FIX
    const patientId = parseInt(params.id); // ✅ FIX

    if (!patientId || isNaN(patientId)) {
      return NextResponse.json({ error: "Invalid patient ID" }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT * FROM patient_insurance 
       WHERE patient_id = $1 
       ORDER BY created_at DESC`,
      [patientId]
    );

    return NextResponse.json(result.rows);

  } catch (error) {
    console.error("GET insurance error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// ✅ ADD insurance
export async function POST(req, context) {
  try {
    const params = await context.params;   // ✅ FIX
    const patientId = parseInt(params.id); // ✅ FIX

    console.log("PATIENT ID:", patientId);

    if (!patientId || isNaN(patientId)) {
      return NextResponse.json({ error: "Invalid patient ID" }, { status: 400 });
    }

    const {
  provider,
  policy_number,
  expiry_date,
  coverage_amount,
  status
} = await req.json();

const result = await pool.query(
  `INSERT INTO patient_insurance
   (patient_id, provider, policy_number, expiry_date, coverage_amount, status)
   VALUES ($1,$2,$3,$4,$5,$6)
   RETURNING *`,
  [
    patientId,
    provider,
    policy_number,
    expiry_date || null,        // ✅ FIX
    coverage_amount || null,    // ✅ FIX
    status || "Active"
  ]
);

    return NextResponse.json(result.rows[0], { status: 201 });

  } catch (error) {
    console.error("POST insurance error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}