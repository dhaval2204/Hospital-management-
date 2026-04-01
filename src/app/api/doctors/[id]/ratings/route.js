import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

export async function GET(req, context) {
  try {
    const { id } = await context.params;
    const result = await pool.query(
      `SELECT dr.*, COALESCE(p.name, 'Anonymous') AS patient_name
       FROM doctor_ratings dr
       LEFT JOIN patients p ON p.id = dr.patient_id
       WHERE dr.doctor_id = $1
       ORDER BY dr.created_at DESC`,
      [Number(id)]
    );
    return Response.json(result.rows);
  } catch (err) {
    console.error('GET ratings error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req, context) {
  const client = await pool.connect();
  try {
    const { id } = await context.params;
    const body = await req.json();

    const doctorId  = parseInt(id);
    const patientId = body.patient_id ? parseInt(body.patient_id) : null;
    const rating    = parseInt(body.rating);
    const review    = (body.review || '').trim() || null;

    if (!doctorId)                        throw new Error('Doctor ID missing');
    if (!rating || rating < 1 || rating > 5) throw new Error('Rating must be 1–5');

    await client.query('BEGIN');

    if (patientId) {
      // Known patient — upsert using the partial index
      await client.query(
        `INSERT INTO doctor_ratings (doctor_id, patient_id, rating, review)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (doctor_id, patient_id)
         WHERE patient_id IS NOT NULL
         DO UPDATE SET rating = EXCLUDED.rating, review = EXCLUDED.review, created_at = NOW()`,
        [doctorId, patientId, rating, review]
      );
    } else {
      // Anonymous — always new row, no conflict possible
      await client.query(
        `INSERT INTO doctor_ratings (doctor_id, patient_id, rating, review)
         VALUES ($1, NULL, $2, $3)`,
        [doctorId, rating, review]
      );
    }

    // Recalculate avg on doctors table
    await client.query(
      `UPDATE doctors SET
         avg_rating   = (SELECT COALESCE(ROUND(AVG(rating)::numeric,2), 0) FROM doctor_ratings WHERE doctor_id = $1),
         rating_count = (SELECT COUNT(*) FROM doctor_ratings WHERE doctor_id = $1)
       WHERE id = $1`,
      [doctorId]
    );

    // Return fresh ratings list + updated doctor stats
    const [ratingsResult, doctorResult] = await Promise.all([
      client.query(
        `SELECT dr.*, COALESCE(p.name, 'Anonymous') AS patient_name
         FROM doctor_ratings dr
         LEFT JOIN patients p ON p.id = dr.patient_id
         WHERE dr.doctor_id = $1
         ORDER BY dr.created_at DESC`,
        [doctorId]
      ),
      client.query(
        `SELECT avg_rating, rating_count FROM doctors WHERE id = $1`,
        [doctorId]
      ),
    ]);

    await client.query('COMMIT');

    return Response.json({
      success:     true,
      ratings:     ratingsResult.rows,
      avgRating:   doctorResult.rows[0]?.avg_rating   || 0,
      ratingCount: doctorResult.rows[0]?.rating_count || 0,
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('POST rating error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  } finally {
    client.release();
  }
}