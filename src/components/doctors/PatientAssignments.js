'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const APPT_STATUS = {
  Pending:   { bg: 'rgba(245,158,11,0.1)',  color: '#d97706' },
  Confirmed: { bg: 'rgba(99,102,241,0.1)',  color: '#4f46e5' },
  Completed: { bg: 'rgba(16,185,129,0.1)',  color: '#059669' },
  Cancelled: { bg: 'rgba(239,68,68,0.1)',   color: '#dc2626' },
  Scheduled: { bg: 'rgba(6,182,212,0.1)',   color: '#0891b2' },
};

function fmt12(t) {
  if (!t) return '';
  const [h, m] = t.toString().slice(0, 5).split(':').map(Number);
  if (isNaN(h)) return '';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

export default function PatientAssignments({ docId }) {
  const router = useRouter();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [allPts, setAllPts] = useState([]);
  const [showAssign, setShowAssign] = useState(false);
  const [assignForm, setAssignForm] = useState({ patient_id: '', notes: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/doctors/${docId}/patients`);
      const data = await res.json();
      setPatients(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed loading patients:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (docId) load(); }, [docId]);

  const openAssign = async () => {
    if (allPts.length === 0) {
      const r = await fetch('/api/patients');
      const d = await r.json();
      setAllPts(Array.isArray(d) ? d : []);
    }
    setShowAssign(true);
  };

  const saveAssign = async () => {
    if (!assignForm.patient_id) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/doctors/${docId}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignForm),
      });
      const data = await res.json();
      if (data.error) { alert(data.error); return; }
      setShowAssign(false);
      setAssignForm({ patient_id: '', notes: '' });
      load();
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (assignmentId, status) => {
    if (!assignmentId) return;
    await fetch(`/api/doctors/${docId}/patients`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignment_id: assignmentId, status }),
    });
    load();
  };

  const activeCount = patients.filter(p => p.status === 'Active').length;
  const dischargedCount = patients.filter(p => p.status === 'Discharged').length;

  const visible = patients.filter(p => {
    if (filter === 'active') return p.status === 'Active';
    if (filter === 'discharged') return p.status === 'Discharged';
    return true;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .pa-wrap * { box-sizing: border-box; }
        .pa-wrap { font-family: 'Plus Jakarta Sans', sans-serif; }
        .pa-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
        .pa-title { font-size: 15px; font-weight: 700; color: #1e1b4b; display: flex; align-items: center; gap: 8px; }
        .pa-dot { width: 7px; height: 7px; border-radius: 50%; background: linear-gradient(135deg,#6366f1,#8b5cf6); flex-shrink: 0; }
        .pa-count { background: rgba(99,102,241,0.1); color: #4f46e5; border-radius: 100px; padding: 1px 9px; font-size: 12px; font-weight: 700; }
        .pa-sub { font-size: 12px; color: #9ca3af; margin-top: 3px; padding-left: 15px; margin-bottom: 14px; }
        .pa-add-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 10px; border: 1.5px solid rgba(99,102,241,0.25); background: rgba(99,102,241,0.06); color: #4f46e5; font-size: 13px; font-weight: 700; font-family: 'Plus Jakarta Sans',sans-serif; cursor: pointer; transition: all 0.2s; }
        .pa-add-btn:hover { background: rgba(99,102,241,0.12); transform: translateY(-1px); }
        .pa-filter-row { display: flex; gap: 6px; margin-bottom: 16px; }
        .pa-filter-btn { padding: 5px 14px; border-radius: 100px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans',sans-serif; transition: all 0.18s; }
        .pa-form { background: #fafafe; border: 1.5px solid rgba(99,102,241,0.15); border-radius: 16px; padding: 20px; margin-bottom: 20px; }
        .pa-form-title { font-size: 14px; font-weight: 700; color: #1e1b4b; margin-bottom: 16px; }
        .pa-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
        .pa-field label { display: block; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px; color: #6366f1; margin-bottom: 5px; }
        .pa-input, .pa-select { width: 100%; padding: 9px 13px; border: 1.5px solid rgba(99,102,241,0.18); border-radius: 10px; font-size: 13.5px; font-family: 'Plus Jakarta Sans',sans-serif; font-weight: 500; color: #1e1b4b; background: white; outline: none; transition: all 0.2s; box-sizing: border-box; }
        .pa-input:focus, .pa-select:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        .pa-actions { display: flex; gap: 8px; }
        .pa-save-btn { padding: 9px 20px; background: linear-gradient(135deg,#6366f1,#4f46e5); color: white; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; font-family: 'Plus Jakarta Sans',sans-serif; cursor: pointer; box-shadow: 0 3px 10px rgba(99,102,241,0.3); transition: all 0.2s; }
        .pa-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .pa-cancel-btn { padding: 9px 20px; background: transparent; color: #6b7280; border: 1.5px solid rgba(107,114,128,0.25); border-radius: 10px; font-size: 13px; font-weight: 700; font-family: 'Plus Jakarta Sans',sans-serif; cursor: pointer; }
        .pa-row { display: flex; align-items: flex-start; gap: 14px; padding: 14px 16px; margin-bottom: 10px; border-radius: 14px; border: 1px solid; transition: all 0.2s; }
        .pa-avatar { width: 42px; height: 42px; border-radius: 11px; color: white; font-size: 15px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .pa-name { font-size: 14px; font-weight: 700; margin-bottom: 3px; }
        .pa-meta { font-size: 12px; color: #9ca3af; font-weight: 500; }
        .pa-btn { padding: 4px 10px; font-size: 11px; border-radius: 7px; cursor: pointer; font-weight: 700; border: 1px solid; background: transparent; font-family: 'Plus Jakarta Sans',sans-serif; transition: all 0.15s; }
        .pa-btn:hover { transform: translateY(-1px); }
        .pa-empty { text-align: center; padding: 40px 20px; }
        .pa-empty-icon { font-size: 36px; margin-bottom: 10px; }
        .pa-empty-text { font-size: 14px; font-weight: 600; color: #a5b4fc; }
        .pa-spinner { width: 28px; height: 28px; margin: 0 auto 10px; border: 3px solid rgba(99,102,241,0.15); border-top-color: #6366f1; border-radius: 50%; animation: pa-spin 0.8s linear infinite; }
        @keyframes pa-spin { to { transform: rotate(360deg); } }
@media(max-width:640px){
  .pa-header{flex-wrap:wrap;gap:10px;}
  .pa-add-btn{width:100%;justify-content:center;}
  .pa-form-grid{grid-template-columns:1fr;}
  .pa-actions{flex-wrap:wrap;}
  .pa-save-btn,.pa-cancel-btn{flex:1;text-align:center;}
  .pa-row{flex-wrap:wrap;gap:10px;}
  .pa-filter-row{flex-wrap:wrap;gap:6px;}
}
@media(max-width:400px){
  .pa-row > div:last-child{width:100%;flex-direction:row;justify-content:flex-end;}
}

      `}</style>

      <div className="pa-wrap">
        {/* Header */}
        <div className="pa-header">
          <div>
            <div className="pa-title">
              <div className="pa-dot" />
              Patients
              {patients.length > 0 && <span className="pa-count">{patients.length}</span>}
            </div>
            <div className="pa-sub">{activeCount} active · {dischargedCount} discharged</div>
          </div>
          <button className="pa-add-btn" onClick={openAssign}>+ Assign Patient</button>
        </div>

        {/* Filter pills */}
        {patients.length > 0 && (
          <div className="pa-filter-row">
            {[
              { key: 'all',        label: `All (${patients.length})` },
              { key: 'active',     label: `Active (${activeCount})` },
              { key: 'discharged', label: `Discharged (${dischargedCount})` },
            ].map(f => (
              <button
                key={f.key}
                className="pa-filter-btn"
                onClick={() => setFilter(f.key)}
                style={{
                  border: filter === f.key ? 'none' : '1.5px solid rgba(99,102,241,0.18)',
                  background: filter === f.key ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : 'transparent',
                  color: filter === f.key ? 'white' : '#6366f1',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        {/* Assign form */}
        {showAssign && (
          <div className="pa-form">
            <div className="pa-form-title">🧑‍⚕️ Assign Patient</div>
            <div className="pa-form-grid">
              <div className="pa-field">
                <label>Patient</label>
                <select
                  className="pa-select"
                  value={assignForm.patient_id}
                  onChange={e => setAssignForm(f => ({ ...f, patient_id: e.target.value }))}
                >
                  <option value="">— Select Patient —</option>
                  {allPts.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Age {p.age})</option>
                  ))}
                </select>
              </div>
              <div className="pa-field">
                <label>Notes (optional)</label>
                <input
                  className="pa-input"
                  value={assignForm.notes}
                  placeholder="e.g. Follow-up visit"
                  onChange={e => setAssignForm(f => ({ ...f, notes: e.target.value }))}
                />
              </div>
            </div>
            <div className="pa-actions">
              <button
                className="pa-save-btn"
                onClick={saveAssign}
                disabled={saving || !assignForm.patient_id}
              >
                {saving ? 'Assigning...' : 'Assign'}
              </button>
              <button className="pa-cancel-btn" onClick={() => setShowAssign(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#a5b4fc' }}>
            <div className="pa-spinner" />
            <div style={{ fontSize: 13, fontWeight: 600 }}>Loading patients...</div>
          </div>
        )}

        {/* Empty */}
        {!loading && patients.length === 0 && !showAssign && (
          <div className="pa-empty">
            <div className="pa-empty-icon">🧑‍⚕️</div>
            <div className="pa-empty-text">No patients yet</div>
            <div style={{ fontSize: 12, color: '#d1d5db', marginTop: 4 }}>
              Assign a patient using the button above
            </div>
          </div>
        )}

        {/* Patient rows */}
        {!loading && visible.map(p => {
          const isDischarged = p.status === 'Discharged';
          const apptS = APPT_STATUS[p.latest_appointment_status] || APPT_STATUS.Pending;

          return (
            <div
              key={p.patient_id}
              className="pa-row"
              style={{
                borderColor: isDischarged ? 'rgba(107,114,128,0.12)' : 'rgba(99,102,241,0.1)',
                background: isDischarged ? '#fafafa' : 'white',
                opacity: isDischarged ? 0.78 : 1,
              }}
            >
              {/* Avatar */}
              <div
                className="pa-avatar"
                style={{
                  background: isDischarged
                    ? 'linear-gradient(135deg,#9ca3af,#6b7280)'
                    : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                  boxShadow: isDischarged ? 'none' : '0 3px 8px rgba(99,102,241,0.3)',
                }}
              >
                {(p.patient_name || '?')[0].toUpperCase()}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="pa-name" style={{ color: isDischarged ? '#6b7280' : '#1e1b4b' }}>
                  {p.patient_name}
                </div>
                <div className="pa-meta">
                  Age {p.age} · {p.disease}
                  {p.blood_group && <> · <span style={{ color: '#ef4444' }}>🩸</span> {p.blood_group}</>}
                </div>

                {/* Latest appointment */}
                {p.latest_appointment_date && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 5, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, color: '#6366f1', fontWeight: 600 }}>
                      📅 {new Date(p.latest_appointment_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {p.latest_appointment_time && ` · ${fmt12(p.latest_appointment_time?.slice(0, 5))}`}
                    </span>
                    <span style={{ fontSize: 10.5, fontWeight: 700, padding: '1px 8px', borderRadius: 100, background: apptS.bg, color: apptS.color }}>
                      {p.latest_appointment_status}
                    </span>
                    {Number(p.appointment_count) > 1 && (
                      <span style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600 }}>
                        +{Number(p.appointment_count) - 1} more
                      </span>
                    )}
                  </div>
                )}

                {p.notes && (
                  <div style={{ fontSize: 11.5, color: '#9ca3af', marginTop: 3, fontStyle: 'italic' }}>{p.notes}</div>
                )}
              </div>

              {/* Right side */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                {/* Status badge */}
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  borderRadius: 100, padding: '3px 10px', fontSize: 11, fontWeight: 700,
                  border: '1px solid',
                  background: isDischarged ? 'rgba(107,114,128,0.1)' : 'rgba(16,185,129,0.1)',
                  color: isDischarged ? '#4b5563' : '#059669',
                  borderColor: isDischarged ? 'rgba(107,114,128,0.25)' : 'rgba(16,185,129,0.25)',
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: isDischarged ? '#6b7280' : '#10b981' }} />
                  {p.status || 'Active'}
                </span>

                <div style={{ display: 'flex', gap: 5 }}>
                  <button
                    className="pa-btn"
                    style={{ borderColor: 'rgba(99,102,241,0.2)', color: '#4f46e5', background: 'rgba(99,102,241,0.06)' }}
                    onClick={() => router.push(`/patients/${p.patient_id}`)}
                  >
                    View
                  </button>
                  {!isDischarged && p.assignment_id && (
                    <button
                      className="pa-btn"
                      style={{ borderColor: 'rgba(239,68,68,0.2)', color: '#dc2626', background: 'rgba(239,68,68,0.06)' }}
                      onClick={() => updateStatus(p.assignment_id, 'Discharged')}
                    >
                      Discharge
                    </button>
                  )}
                  {isDischarged && p.assignment_id && (
                    <button
                      className="pa-btn"
                      style={{ borderColor: 'rgba(16,185,129,0.2)', color: '#059669', background: 'rgba(16,185,129,0.06)' }}
                      onClick={() => updateStatus(p.assignment_id, 'Active')}
                    >
                      Reactivate
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}