'use client';
import { useState, useEffect } from 'react';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
.rp * { box-sizing: border-box; }
.rp { font-family: 'Plus Jakarta Sans', sans-serif; }
.rp-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.rp-title { font-size: 15px; font-weight: 700; color: #1e1b4b; display: flex; align-items: center; gap: 8px; }
.rp-dot { width: 7px; height: 7px; border-radius: 50%; background: linear-gradient(135deg,#6366f1,#8b5cf6); flex-shrink: 0; }
.rp-add-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 10px; border: 1.5px solid rgba(99,102,241,0.25); background: rgba(99,102,241,0.06); color: #4f46e5; font-size: 13px; font-weight: 700; font-family: 'Plus Jakarta Sans',sans-serif; cursor: pointer; transition: all 0.2s; }
.rp-add-btn:hover { background: rgba(99,102,241,0.12); transform: translateY(-1px); }
.rp-summary { display: flex; gap: 24px; align-items: center; background: linear-gradient(135deg,#f5f3ff,#ede9fe); border-radius: 16px; padding: 20px; margin-bottom: 24px; }
.rp-big-score { font-size: 52px; font-weight: 800; color: #1e1b4b; line-height: 1; letter-spacing: -2px; }
.rp-big-label { font-size: 12px; color: #6b7280; font-weight: 600; margin-top: 4px; }
.rp-bars { flex: 1; }
.rp-bar-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.rp-bar-label { font-size: 12px; color: #6b7280; font-weight: 600; width: 28px; text-align: right; }
.rp-bar-track { flex: 1; height: 7px; background: rgba(99,102,241,0.12); border-radius: 99px; overflow: hidden; }
.rp-bar-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg,#6366f1,#8b5cf6); transition: width 0.4s ease; }
.rp-bar-count { font-size: 11px; color: #9ca3af; font-weight: 600; width: 20px; }
.rp-form { background: #fafafe; border: 1.5px solid rgba(99,102,241,0.15); border-radius: 16px; padding: 20px; margin-bottom: 20px; }
.rp-form-title { font-size: 14px; font-weight: 700; color: #1e1b4b; margin-bottom: 16px; }
.rp-field { margin-bottom: 14px; }
.rp-field label { display: block; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px; color: #6366f1; margin-bottom: 6px; }
.rp-input,.rp-select,.rp-textarea { width: 100%; padding: 10px 13px; border: 1.5px solid rgba(99,102,241,0.18); border-radius: 10px; font-size: 13.5px; font-family: 'Plus Jakarta Sans',sans-serif; font-weight: 500; color: #1e1b4b; background: white; outline: none; transition: all 0.2s; }
.rp-input:focus,.rp-select:focus,.rp-textarea:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
.rp-textarea { resize: vertical; }
.rp-star-row { display: flex; gap: 8px; }
.rp-star { font-size: 28px; cursor: pointer; transition: transform 0.15s; line-height: 1; }
.rp-star:hover { transform: scale(1.2); }
.rp-form-actions { display: flex; gap: 8px; margin-top: 16px; }
.rp-save-btn { padding: 10px 22px; background: linear-gradient(135deg,#6366f1,#4f46e5); color: white; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; font-family: 'Plus Jakarta Sans',sans-serif; cursor: pointer; box-shadow: 0 3px 10px rgba(99,102,241,0.3); transition: all 0.2s; }
.rp-save-btn:hover:not(:disabled) { transform: translateY(-1px); }
.rp-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.rp-cancel-btn { padding: 10px 18px; background: transparent; color: #6b7280; border: 1.5px solid rgba(107,114,128,0.25); border-radius: 10px; font-size: 13px; font-weight: 700; font-family: 'Plus Jakarta Sans',sans-serif; cursor: pointer; transition: all 0.2s; }
.rp-cancel-btn:hover { background: rgba(107,114,128,0.06); }
.rp-review-card { background: #fafafe; border: 1px solid rgba(99,102,241,0.1); border-radius: 14px; padding: 16px; margin-bottom: 10px; transition: border-color 0.2s; }
.rp-review-card:hover { border-color: rgba(99,102,241,0.22); }
.rp-review-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
.rp-reviewer-name { font-size: 14px; font-weight: 700; color: #1e1b4b; }
.rp-review-date { font-size: 11px; color: #9ca3af; font-weight: 500; }
.rp-review-stars { display: flex; gap: 2px; margin-bottom: 6px; }
.rp-review-text { font-size: 13px; color: #4b5563; line-height: 1.6; font-weight: 500; }
.rp-empty { text-align: center; padding: 40px 20px; }
.rp-empty-icon { font-size: 36px; margin-bottom: 10px; }
.rp-empty-text { font-size: 14px; font-weight: 600; color: #a5b4fc; }
.rp-error { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); border-radius: 10px; padding: 10px 14px; color: #dc2626; font-size: 13px; font-weight: 600; margin-bottom: 14px; }
.rp-success { background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2); border-radius: 10px; padding: 10px 14px; color: #059669; font-size: 13px; font-weight: 600; margin-bottom: 14px; }
`;

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="rp-star-row">
      {[1,2,3,4,5].map(i => (
        <span
          key={i}
          className="rp-star"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
          style={{ color: i <= (hover || value) ? '#f59e0b' : '#d1d5db' }}
        >★</span>
      ))}
      {value > 0 && (
        <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 600, marginLeft: 8, alignSelf: 'center' }}>
          {['','Poor','Fair','Good','Very Good','Excellent'][value]}
        </span>
      )}
    </div>
  );
}

export default function RatingsPanel({ doctorId, ratings: initialRatings, avgRating: initialAvg, onUpdate }) {
  const [ratings, setRatings]       = useState(initialRatings || []);
  const [avgRating, setAvgRating]   = useState(Number(initialAvg || 0));
  const [showForm, setShowForm]     = useState(false);
  const [patients, setPatients]     = useState([]);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [form, setForm]             = useState({ patient_id: '', rating: 0, review: '' });

  // Sync when parent passes new data
  useEffect(() => {
    setRatings(initialRatings || []);
    setAvgRating(Number(initialAvg || 0));
  }, [initialRatings, initialAvg]);

  const openForm = async () => {
    setError('');
    setSuccess('');
    if (patients.length === 0) {
      try {
        const res = await fetch('/api/patients');
        const data = await res.json();
        setPatients(Array.isArray(data) ? data : []);
      } catch {
        setPatients([]);
      }
    }
    setShowForm(true);
  };

  const submit = async () => {
    setError('');
    if (!form.rating || form.rating < 1) {
      setError('Please select a star rating.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/doctors/${doctorId}/ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: form.patient_id ? Number(form.patient_id) : null,
          rating:     form.rating,
          review:     form.review,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || 'Failed to save rating. Please try again.');
        setSaving(false);
        return;
      }

      // ✅ Update local state immediately — no page reload needed
      setRatings(data.ratings);
      setAvgRating(Number(data.avgRating || 0));
      setShowForm(false);
      setForm({ patient_id: '', rating: 0, review: '' });
      setSuccess('Review submitted successfully!');
      setTimeout(() => setSuccess(''), 3000);

      // Also notify parent to refresh hero stats
      if (onUpdate) {
        onUpdate({
          ratings:     data.ratings,
          avgRating:   data.avgRating,
          ratingCount: data.ratingCount,
        });
      }

    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Build star distribution
  const dist = [5,4,3,2,1].map(s => ({
    star: s,
    count: ratings.filter(r => r.rating === s).length,
    pct: ratings.length
      ? Math.round(ratings.filter(r => r.rating === s).length / ratings.length * 100)
      : 0,
  }));

  return (
    <>
      <style>{CSS}</style>
      <div className="rp">
        <div className="rp-header">
          <div className="rp-title">
            <div className="rp-dot" />
            Ratings & Reviews
            {ratings.length > 0 && (
              <span style={{ background:'rgba(99,102,241,0.1)', color:'#4f46e5', borderRadius:'100px', padding:'1px 9px', fontSize:12, fontWeight:700 }}>
                {ratings.length}
              </span>
            )}
          </div>
          <button className="rp-add-btn" onClick={openForm}>+ Add Review</button>
        </div>

        {/* Summary card */}
        <div className="rp-summary">
          <div style={{ textAlign:'center', flexShrink:0 }}>
            <div className="rp-big-score">{Number(avgRating).toFixed(1)}</div>
            <div style={{ display:'flex', justifyContent:'center', gap:2, margin:'6px 0 4px' }}>
              {[1,2,3,4,5].map(i => (
                <span key={i} style={{ fontSize:16, color: i<=Math.round(avgRating) ? '#f59e0b' : '#d1d5db' }}>★</span>
              ))}
            </div>
            <div className="rp-big-label">{ratings.length} review{ratings.length !== 1 ? 's' : ''}</div>
          </div>
          <div className="rp-bars">
            {dist.map(({ star, count, pct }) => (
              <div key={star} className="rp-bar-row">
                <span className="rp-bar-label">{star}★</span>
                <div className="rp-bar-track">
                  <div className="rp-bar-fill" style={{ width:`${pct}%` }} />
                </div>
                <span className="rp-bar-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        {error   && <div className="rp-error">⚠️ {error}</div>}
        {success && <div className="rp-success">✓ {success}</div>}

        {/* Add review form */}
        {showForm && (
          <div className="rp-form">
            <div className="rp-form-title">⭐ Add Review</div>

            <div className="rp-field">
              <label>Patient (optional)</label>
              <select className="rp-select" value={form.patient_id}
                onChange={e => setForm(f => ({ ...f, patient_id: e.target.value }))}>
                <option value="">— Anonymous / Select patient —</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (Age {p.age})</option>
                ))}
              </select>
            </div>

            <div className="rp-field">
              <label>Rating *</label>
              <StarPicker
                value={form.rating}
                onChange={r => setForm(f => ({ ...f, rating: r }))}
              />
            </div>

            <div className="rp-field">
              <label>Review (optional)</label>
              <textarea
                className="rp-textarea"
                rows={3}
                placeholder="Share your experience with this doctor..."
                value={form.review}
                onChange={e => setForm(f => ({ ...f, review: e.target.value }))}
              />
            </div>

            <div className="rp-form-actions">
              <button className="rp-save-btn" onClick={submit} disabled={saving || !form.rating}>
                {saving ? 'Submitting...' : 'Submit Review'}
              </button>
              <button className="rp-cancel-btn" onClick={() => { setShowForm(false); setError(''); }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Reviews list */}
        {ratings.length === 0 && !showForm ? (
          <div className="rp-empty">
            <div className="rp-empty-icon">⭐</div>
            <div className="rp-empty-text">No reviews yet — be the first!</div>
          </div>
        ) : (
          ratings.map((r, i) => (
            <div key={r.id || i} className="rp-review-card">
              <div className="rp-review-top">
                <div>
                  <div className="rp-reviewer-name">{r.patient_name || 'Anonymous'}</div>
                  <div className="rp-review-stars">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} style={{ fontSize:14, color: s<=r.rating ? '#f59e0b' : '#d1d5db' }}>★</span>
                    ))}
                    <span style={{ fontSize:12, color:'#6b7280', fontWeight:600, marginLeft:6 }}>
                      {['','Poor','Fair','Good','Very Good','Excellent'][r.rating]}
                    </span>
                  </div>
                </div>
                <div className="rp-review-date">
                  {r.created_at
                    ? new Date(r.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
                    : 'Just now'
                  }
                </div>
              </div>
              {r.review && (
                <div className="rp-review-text">"{r.review}"</div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}