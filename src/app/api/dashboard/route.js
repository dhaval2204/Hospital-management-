import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    // 🔥 COUNTS
    const patients = await pool.query("SELECT COUNT(*) FROM patients");
    const doctors = await pool.query("SELECT COUNT(*) FROM doctors");

    const todayAppointments = await pool.query(`
      SELECT COUNT(*) FROM appointments 
      WHERE DATE(appointment_date) = CURRENT_DATE
    `);

    const pendingAppointments = await pool.query(`
      SELECT COUNT(*) FROM appointments 
      WHERE status = 'Pending'
    `);

    // 🔥 APPOINTMENTS PER DAY
    const daily = await pool.query(`
      SELECT DATE(appointment_date) as date, COUNT(*) as count
      FROM appointments
      GROUP BY date
      ORDER BY date
    `);

    // 🔥 DOCTOR LOAD
    const doctorLoad = await pool.query(`
      SELECT d.name, COUNT(a.id) as total
      FROM doctors d
      LEFT JOIN appointments a ON d.id = a.doctor_id
      GROUP BY d.name
    `);

    // 🔥 STATUS DISTRIBUTION
    const status = await pool.query(`
      SELECT status, COUNT(*) as total
      FROM appointments
      GROUP BY status
    `);

    return NextResponse.json({
      counts: {
        patients: patients.rows[0].count,
        doctors: doctors.rows[0].count,
        today: todayAppointments.rows[0].count,
        pending: pendingAppointments.rows[0].count,
      },
      daily: daily.rows,
      doctorLoad: doctorLoad.rows,
      status: status.rows,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message });
  }
}