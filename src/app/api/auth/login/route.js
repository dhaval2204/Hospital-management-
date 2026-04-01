// import { NextResponse } from "next/server";
// import pool from "@/lib/db";

// export async function POST(req) {
//   try {
//     const { email, password } = await req.json();

//     const result = await pool.query(
//       "SELECT * FROM users WHERE email=$1 AND password=$2",
//       [email, password]
//     );

//     if (result.rows.length === 0) {
//       return NextResponse.json(
//         { error: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     const user = result.rows[0];

//     return NextResponse.json({
//       id: user.id,
//       name: user.name,
//       role: user.role,
//     });

//   } catch (error) {
//     console.error("LOGIN ERROR 👉", error);

//     return NextResponse.json(
//       { error: error.message },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // 🔥 FIRST CHECK USERS TABLE
    const userRes = await pool.query(
      "SELECT * FROM users WHERE email=$1 AND password=$2",
      [email, password]
    );

    if (userRes.rows.length > 0) {
      const user = userRes.rows[0];

      return NextResponse.json({
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
      });
    }

    // 🔥 IF NOT USER → CHECK DOCTOR LOGIN
    const doctorRes = await pool.query(
      "SELECT * FROM doctors WHERE email=$1",
      [email]
    );

    if (doctorRes.rows.length > 0) {
      const doctor = doctorRes.rows[0];

      return NextResponse.json({
        id: doctor.id,
        name: doctor.name,
        role: "Doctor",
        email: doctor.email,
      });
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}