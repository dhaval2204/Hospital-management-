// import { NextResponse } from "next/server";
// import pool from "@/lib/db";

// // GET all appointments, or filtered by ?patient_id=X
// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const patientId = searchParams.get("patient_id");

//     let result;
//     if (patientId) {
//       // Filter by patient — join with doctors to get doctor_name & specialization
//       result = await pool.query(
//         `SELECT 
//            a.id, a.appointment_date, a.status,
//            p.name as patient_name,
//            d.name as doctor_name,
//            d.specialization
//          FROM appointments a
//          JOIN patients p ON a.patient_id = p.id
//          JOIN doctors d ON a.doctor_id = d.id
//          WHERE a.patient_id = $1
//          ORDER BY a.appointment_date DESC`,
//         [parseInt(patientId)]
//       );
//     } else {
//       // Return all appointments
//       result = await pool.query(
//         `SELECT 
//            a.id, a.appointment_date, a.status,
//            p.name as patient_name,
//            d.name as doctor_name,
//            d.specialization
//          FROM appointments a
//          JOIN patients p ON a.patient_id = p.id
//          JOIN doctors d ON a.doctor_id = d.id
//          ORDER BY a.appointment_date DESC`
//       );
//     }

//     return NextResponse.json(result.rows);
//   } catch (error) {
//     console.error("GET appointments error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// // POST new appointment
// export async function POST(req) {
//   try {
//     const { patient_id, doctor_id, appointment_date, status } = await req.json();

// const result = await pool.query(
//   `INSERT INTO appointments (patient_id, doctor_id, appointment_date, status)
//    VALUES ($1, $2, $3, $4) RETURNING *`,
//   [patient_id, doctor_id, appointment_date, status || "Pending"]
// );

// // 🔥 AUTO ASSIGN PATIENT TO DOCTOR
// await pool.query(
//   `INSERT INTO doctor_patient_assignments (doctor_id, patient_id, status)
//    VALUES ($1, $2, 'Active')
//    ON CONFLICT (doctor_id, patient_id)
//    DO UPDATE SET status='Active'`,
//   [doctor_id, patient_id]
// );

// return NextResponse.json(result.rows[0], { status: 201 });
//   } catch (error) {
//     console.error("POST appointment error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET all appointments (optionally filtered by patient_id)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patient_id');

    let result;
    if (patientId) {
      result = await pool.query(
        `SELECT a.id, a.appointment_date, a.appointment_time, a.status, a.notes,
                p.name as patient_name, d.name as doctor_name, d.specialization
         FROM appointments a
         JOIN patients p ON a.patient_id = p.id
         JOIN doctors d ON a.doctor_id = d.id
         WHERE a.patient_id = $1
         ORDER BY a.appointment_date DESC, a.appointment_time`,
        [parseInt(patientId)]
      );
    } else {
      result = await pool.query(
        `SELECT a.id, a.appointment_date, a.appointment_time, a.status, a.notes,
                a.patient_id, a.doctor_id,
                p.name as patient_name, d.name as doctor_name, d.specialization
         FROM appointments a
         JOIN patients p ON a.patient_id = p.id
         JOIN doctors d ON a.doctor_id = d.id
         ORDER BY a.appointment_date DESC, a.appointment_time`
      );
    }

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('GET appointments error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST new appointment (with optional time slot)
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      patient_id, doctor_id, appointment_date,
      appointment_time, status, notes
    } = body;

    if (!patient_id || !doctor_id || !appointment_date) {
      return NextResponse.json({ error: 'patient_id, doctor_id, appointment_date are required' }, { status: 400 });
    }

    // If a time slot is given, check it's not already booked
    if (appointment_time) {
      const conflict = await pool.query(
        `SELECT id FROM appointments
         WHERE doctor_id = $1
           AND appointment_date = $2
           AND appointment_time = $3
           AND status NOT IN ('Cancelled')`,
        [doctor_id, appointment_date, appointment_time]
      );
      if (conflict.rows.length > 0) {
        return NextResponse.json({ error: 'This time slot is already booked' }, { status: 409 });
      }
    }

    const result = await pool.query(
      `INSERT INTO appointments
         (patient_id, doctor_id, appointment_date, appointment_time, status, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [patient_id, doctor_id, appointment_date, appointment_time || null, status || 'Pending', notes || null]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error('POST appointment error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}