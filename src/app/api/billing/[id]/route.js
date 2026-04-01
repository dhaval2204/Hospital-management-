import { NextResponse } from "next/server";
import pool from "@/lib/db";

// UPDATE PAYMENT STATUS
export async function PUT(req, context) {
  const params = await context.params;
  const id = parseInt(params.id);

  const { status } = await req.json();

  await pool.query(
    "UPDATE billing SET status=$1 WHERE id=$2",
    [status, id]
  );

  return NextResponse.json({ success: true });
}