import { NextResponse } from "next/server";
import pool from "@/lib/db";

// ✅ GET single patient by ID
export async function GET(req, context) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Try with extended columns first, fall back to base columns
    let result;
    try {
      result = await pool.query(
        `SELECT id, name, age, disease, created_at,
                COALESCE(blood_group, '') as blood_group,
                COALESCE(phone, '') as phone,
                COALESCE(email, '') as email,
                COALESCE(address, '') as address,
                COALESCE(gender, '') as gender
         FROM patients WHERE id = $1`,
        [id]
      );
    } catch {
      // Extended columns don't exist yet — use base query
      result = await pool.query(
        `SELECT id, name, age, disease, created_at,
                '' as blood_group, '' as phone,
                '' as email, '' as address, '' as gender
         FROM patients WHERE id = $1`,
        [id]
      );
    }

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("GET patient error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ UPDATE patient
// ✅ UPDATE patient
export async function PUT(req, context) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();

    const {
      name,
      age,
      disease,
      blood_group,
      phone,
      email,
      address,
      gender
    } = body;

    const result = await pool.query(
      `UPDATE patients SET 
        name=$1,
        age=$2,
        disease=$3,
        blood_group=$4,
        phone=$5,
        email=$6,
        address=$7,
        gender=$8
      WHERE id=$9 RETURNING *`,
      [
        name,
        parseInt(age),
        disease,
        blood_group,
        phone,
        email,
        address,
        gender,
        id
      ]
    );

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("PUT ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ DELETE patient
export async function DELETE(req, context) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const result = await pool.query(
      "DELETE FROM patients WHERE id=$1 RETURNING *",
      [id]
    );

    return NextResponse.json({ success: true, deleted: result.rows });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}