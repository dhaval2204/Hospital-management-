import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET
export async function GET() {
  const result = await pool.query("SELECT * FROM patients ORDER BY id DESC");
  return NextResponse.json(result.rows);
}

// POST
// POST
export async function POST(req) {
  const {
    name,
    age,
    disease,
    blood_group,
    phone,
    email,
    address,
    gender
  } = await req.json();

  const result = await pool.query(
    `INSERT INTO patients 
    (name, age, disease, blood_group, phone, email, address, gender) 
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8) 
    RETURNING *`,
    [
      name,
      parseInt(age),
      disease,
      blood_group,
      phone,
      email,
      address,
      gender
    ]
  );

  return NextResponse.json(result.rows[0]);
}