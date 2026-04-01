import { NextResponse } from 'next/server';
import pool from '@/lib/db';

/**
 * GET /api/appointments/slots?doctor_id=X&date=YYYY-MM-DD
 *
 * Returns available time slots for a doctor on a given date.
 * Blocks: already booked slots, doctor leave days.
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = parseInt(searchParams.get('doctor_id'));
    const date = searchParams.get('date'); // YYYY-MM-DD

    if (!doctorId || !date) {
      return NextResponse.json({ error: 'doctor_id and date are required' }, { status: 400 });
    }

    // Get day of week from date
    const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const dayOfWeek = dayNames[new Date(date).getDay()];

    // 1. Get doctor's schedule for that day
    const scheduleRes = await pool.query(
      `SELECT * FROM doctor_schedules
       WHERE doctor_id = $1 AND day_of_week = $2 AND is_available = true`,
      [doctorId, dayOfWeek]
    );

    if (scheduleRes.rows.length === 0) {
      return NextResponse.json({
        available: false,
        reason: `Doctor is not available on ${dayOfWeek}`,
        slots: [],
      });
    }

    const schedule = scheduleRes.rows[0];

    // 2. Check if doctor is on leave that day
    const leaveRes = await pool.query(
      `SELECT * FROM doctor_leaves
       WHERE doctor_id = $1
         AND status = 'Approved'
         AND from_date <= $2
         AND to_date >= $2`,
      [doctorId, date]
    );

    if (leaveRes.rows.length > 0) {
      return NextResponse.json({
        available: false,
        reason: 'Doctor is on approved leave on this date',
        slots: [],
      });
    }

    // 3. Get already booked slots for that doctor+date
    const bookedRes = await pool.query(
      `SELECT appointment_time FROM appointments
       WHERE doctor_id = $1
         AND appointment_date = $2
         AND status NOT IN ('Cancelled')
         AND appointment_time IS NOT NULL`,
      [doctorId, date]
    );

    const bookedTimes = new Set(
      bookedRes.rows.map(r => r.appointment_time?.slice(0, 5)) // HH:MM
    );

    // 4. Generate all slots between start_time and end_time
    const slotDuration = schedule.slot_duration_mins || 30;
    const slots = [];

    const [startH, startM] = schedule.start_time.split(':').map(Number);
    const [endH, endM] = schedule.end_time.split(':').map(Number);
    const startMins = startH * 60 + startM;
    const endMins = endH * 60 + endM;

    for (let mins = startMins; mins + slotDuration <= endMins; mins += slotDuration) {
      const h = Math.floor(mins / 60).toString().padStart(2, '0');
      const m = (mins % 60).toString().padStart(2, '0');
      const time = `${h}:${m}`;
      const label = formatTime(time);

      // Skip past slots if booking for today
      const now = new Date();
      const isToday = date === now.toISOString().split('T')[0];
      const slotPast = isToday && (now.getHours() * 60 + now.getMinutes()) >= mins;

      slots.push({
        time,          // "09:00"
        label,         // "9:00 AM"
        booked: bookedTimes.has(time),
        past: slotPast,
        available: !bookedTimes.has(time) && !slotPast,
      });
    }

    return NextResponse.json({
      available: true,
      day: dayOfWeek,
      schedule: {
        start: schedule.start_time,
        end: schedule.end_time,
        slot_duration: slotDuration,
      },
      slots,
      total: slots.length,
      booked: slots.filter(s => s.booked).length,
      free: slots.filter(s => s.available).length,
    });

  } catch (err) {
    console.error('Slots API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

function formatTime(time24) {
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
}