'use client';
import { useState } from 'react';

const STATUS_STYLE = {
  Pending:  { bg: 'rgba(245,158,11,0.1)',  color: '#d97706', border: 'rgba(245,158,11,0.25)',  dot: '#f59e0b' },
  Approved: { bg: 'rgba(99,102,241,0.1)',  color: '#4f46e5', border: 'rgba(99,102,241,0.25)',  dot: '#6366f1' },
  Rejected: { bg: 'rgba(239,68,68,0.1)',   color: '#dc2626', border: 'rgba(239,68,68,0.25)',   dot: '#ef4444' },
};

function Badge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.Pending;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, borderRadius: 100, padding: '3px 10px', fontSize: 11.5, fontWeight: 700, border: `1px solid ${s.border}`, background: s.bg, color: s.color }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot }} />
      {status}
    </span>
  );
}

export default function LeaveManager({ docId, leaves = [], onUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ from_date: '', to_date: '', reason: '' });
  const [saving, setSaving] = useState(false);

  const saveLeave = async () => {
    if (!form.from_date || !form.to_date) return;
    setSaving(true);
    await fetch(`/api/doctors/${docId}/leaves`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setShowForm(false);
    setForm({ from_date: '', to_date: '', reason: '' });
    setSaving(false);
    if (onUpdate) onUpdate();
  };

  const updateLeave = async (leaveId, status) => {
    await fetch(`/api/doctors/${docId}/leaves`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leave_id: leaveId, status }),
    });
    if (onUpdate) onUpdate();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .lm-wrap * { box-sizing: border-box; }
        .lm-wrap { font-family: 'Plus Jakarta Sans', sans-serif; }
        .lm-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .lm-title { font-size: 15px; font-weight: 700; color: #1e1b4b; display: flex; align-items: center; gap: 8px; }
        .lm-dot { width: 7px; height: 7px; border-radius: 50%; background: linear-gradient(135deg,#6366f1,#8b5cf6); flex-shrink: 0; }
        .lm-add-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 10px; border: 1.5px solid rgba(99,102,241,0.25); background: rgba(99,102,241,0.06); color: #4f46e5; font-size: 13px; font-weight: 700; font-family: 'Plus Jakarta Sans',sans-serif; cursor: pointer; transition: all 0.2s; }
        .lm-add-btn:hover { background: rgba(99,102,241,0.12); transform: translateY(-1px); }
        .lm-form { background: #fafafe; border: 1.5px solid rgba(99,102,241,0.15); border-radius: 16px; padding: 20px; margin-bottom: 20px; }
        .lm-form-title { font-size: 14px; font-weight: 700; color: #1e1b4b; margin-bottom: 16px; }
        .lm-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
        .lm-field label { display: block; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px; color: #6366f1; margin-bottom: 5px; }
        .lm-input { width: 100%; padding: 9px 13px; border: 1.5px solid rgba(99,102,241,0.18); border-radius: 10px; font-size: 13.5px; font-family: 'Plus Jakarta Sans',sans-serif; font-weight: 500; color: #1e1b4b; background: white; outline: none; transition: all 0.2s; box-sizing: border-box; }
        .lm-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        .lm-actions { display: flex; gap: 8px; }
        .lm-save-btn { padding: 9px 20px; background: linear-gradient(135deg,#6366f1,#4f46e5); color: white; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; font-family: 'Plus Jakarta Sans',sans-serif; cursor: pointer; box-shadow: 0 3px 10px rgba(99,102,241,0.3); transition: all 0.2s; }
        .lm-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .lm-cancel-btn { padding: 9px 20px; background: transparent; color: #6b7280; border: 1.5px solid rgba(107,114,128,0.25); border-radius: 10px; font-size: 13px; font-weight: 700; font-family: 'Plus Jakarta Sans',sans-serif; cursor: pointer; }
        .lm-card { background: #fafafe; border: 1px solid rgba(99,102,241,0.08); border-radius: 14px; padding: 16px; margin-bottom: 10px; transition: border-color 0.2s; }
        .lm-card:hover { border-color: rgba(99,102,241,0.2); }
        .lm-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
        .lm-dates { font-size: 14px; font-weight: 700; color: #1e1b4b; }
        .lm-reason { font-size: 13px; color: #6b7280; font-weight: 500; margin-top: 3px; }
        .lm-action-btn { padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 700; font-family: 'Plus Jakarta Sans',sans-serif; cursor: pointer; border: none; transition: all 0.2s; }
        .lm-empty { text-align: center; padding: 40px 20px; }
        .lm-empty-icon { font-size: 36px; margin-bottom: 10px; }
        .lm-empty-text { font-size: 14px; font-weight: 600; color: #a5b4fc; }
@media(max-width:640px){
  .lm-form-grid{grid-template-columns:1fr;}
  .lm-header{flex-wrap:wrap;gap:10px;}
  .lm-add-btn{width:100%;justify-content:center;}
  .lm-actions{flex-wrap:wrap;}
  .lm-save-btn,.lm-cancel-btn{flex:1;text-align:center;}
}

      `}</style>

      <div className="lm-wrap">
        <div className="lm-header">
          <div className="lm-title"><div className="lm-dot" />Leave Management</div>
          <button className="lm-add-btn" onClick={() => setShowForm(true)}>+ Apply Leave</button>
        </div>

        {showForm && (
          <div className="lm-form">
            <div className="lm-form-title">🏖️ Apply Leave</div>
            <div className="lm-form-grid">
              {[['From Date', 'from_date', 'date'], ['To Date', 'to_date', 'date']].map(([label, key, type]) => (
                <div key={key} className="lm-field">
                  <label>{label}</label>
                  <input
                    type={type}
                    className="lm-input"
                    value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  />
                </div>
              ))}
              <div className="lm-field" style={{ gridColumn: '1/-1' }}>
                <label>Reason</label>
                <input
                  className="lm-input"
                  value={form.reason}
                  onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                  placeholder="e.g. Medical conference"
                />
              </div>
            </div>
            <div className="lm-actions">
              <button
                className="lm-save-btn"
                onClick={saveLeave}
                disabled={saving || !form.from_date || !form.to_date}
              >
                {saving ? 'Saving...' : 'Submit'}
              </button>
              <button className="lm-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}

        {leaves.length === 0 && !showForm ? (
          <div className="lm-empty">
            <div className="lm-empty-icon">🏖️</div>
            <div className="lm-empty-text">No leave records</div>
          </div>
        ) : leaves.map(l => (
          <div key={l.id} className="lm-card">
            <div className="lm-card-top">
              <div>
                <div className="lm-dates">
                  📅 {new Date(l.from_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {' → '}
                  {new Date(l.to_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                {l.reason && <div className="lm-reason">{l.reason}</div>}
              </div>
              <Badge status={l.status || 'Pending'} />
            </div>
            {l.status === 'Pending' && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="lm-action-btn"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: 'white', boxShadow: '0 2px 8px rgba(99,102,241,0.3)' }}
                  onClick={() => updateLeave(l.id, 'Approved')}
                >
                  ✓ Approve
                </button>
                <button
                  className="lm-action-btn"
                  style={{ background: 'rgba(239,68,68,0.08)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.2)' }}
                  onClick={() => updateLeave(l.id, 'Rejected')}
                >
                  ✕ Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}