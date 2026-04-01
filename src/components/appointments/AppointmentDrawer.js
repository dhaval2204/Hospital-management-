'use client';
import { useEffect, useState } from 'react';
import AppointmentReceipt from './AppointmentReceipt';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
.adr-overlay { position:fixed; inset:0; background:rgba(15,10,40,0.45); z-index:1000; display:flex; justify-content:flex-end; animation:adr-fade-in 0.2s ease; }
.adr-overlay.closing { animation:adr-fade-out 0.22s ease forwards; }
@keyframes adr-fade-in  { from{opacity:0} to{opacity:1} }
@keyframes adr-fade-out { from{opacity:1} to{opacity:0} }
.adr-drawer { width:min(540px,100vw); height:100vh; background:white; display:flex; flex-direction:column; font-family:'Plus Jakarta Sans',sans-serif; animation:adr-slide-in 0.28s cubic-bezier(0.34,1.1,0.64,1); overflow:hidden; }
.adr-overlay.closing .adr-drawer { animation:adr-slide-out 0.22s ease forwards; }
@keyframes adr-slide-in  { from{transform:translateX(100%)} to{transform:translateX(0)} }
@keyframes adr-slide-out { from{transform:translateX(0)} to{transform:translateX(100%)} }
.adr-top-bar { height:4px; background:linear-gradient(90deg,#6366f1,#8b5cf6,#06b6d4); flex-shrink:0; }
.adr-header { display:flex; align-items:center; justify-content:space-between; padding:18px 24px; border-bottom:1px solid rgba(99,102,241,0.1); flex-shrink:0; }
.adr-header-left { display:flex; align-items:center; gap:10px; }
.adr-header-title { font-size:16px; font-weight:800; color:#1e1b4b; }
.adr-header-sub { font-size:12px; color:#9ca3af; font-weight:500; }
.adr-close { width:32px; height:32px; border-radius:8px; border:1.5px solid rgba(99,102,241,0.18); background:rgba(99,102,241,0.04); color:#6366f1; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.18s; }
.adr-close:hover { background:rgba(239,68,68,0.08); border-color:rgba(239,68,68,0.3); color:#dc2626; }
.adr-body { flex:1; overflow-y:auto; padding:0; }
.adr-body::-webkit-scrollbar { width:4px; }
.adr-body::-webkit-scrollbar-track { background:transparent; }
.adr-body::-webkit-scrollbar-thumb { background:rgba(99,102,241,0.2); border-radius:2px; }
.adr-hero { padding:20px 24px; background:linear-gradient(135deg,#f5f3ff,#ede9fe); border-bottom:1px solid rgba(99,102,241,0.1); }
.adr-appt-id { font-size:10.5px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#a5b4fc; margin-bottom:10px; }
.adr-date-row { display:flex; align-items:center; gap:14px; margin-bottom:14px; }
.adr-date-block { width:56px; height:56px; border-radius:14px; background:linear-gradient(135deg,#6366f1,#8b5cf6); display:flex; flex-direction:column; align-items:center; justify-content:center; color:white; flex-shrink:0; }
.adr-date-day { font-size:22px; font-weight:800; line-height:1; }
.adr-date-month { font-size:9px; font-weight:700; letter-spacing:0.5px; opacity:0.85; text-transform:uppercase; }
.adr-date-info { flex:1; }
.adr-date-full { font-size:15px; font-weight:700; color:#1e1b4b; margin-bottom:3px; }
.adr-time-badge { display:inline-flex; align-items:center; gap:5px; background:white; border:1.5px solid rgba(99,102,241,0.2); border-radius:100px; padding:3px 12px; font-size:12px; font-weight:700; color:#4f46e5; }
.adr-status-row { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.adr-badge { display:inline-flex; align-items:center; gap:5px; border-radius:100px; padding:4px 12px; font-size:12px; font-weight:700; border:1px solid; }
.adr-badge-dot { width:6px; height:6px; border-radius:50%; }
.adr-section { padding:18px 24px; border-bottom:1px solid rgba(99,102,241,0.07); }
.adr-sec-title { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:#a5b4fc; margin-bottom:14px; display:flex; align-items:center; gap:6px; }
.adr-sec-icon { font-size:14px; }
.adr-person-card { display:flex; align-items:center; gap:12px; padding:14px; background:#fafafe; border:1px solid rgba(99,102,241,0.09); border-radius:14px; margin-bottom:10px; }
.adr-person-avatar { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:800; color:white; flex-shrink:0; }
.adr-person-name { font-size:14px; font-weight:700; color:#1e1b4b; margin-bottom:2px; }
.adr-person-sub { font-size:12px; color:#6b7280; font-weight:500; }
.adr-person-sub b { color:#4f46e5; font-weight:700; }
.adr-meta-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:10px; }
.adr-meta-cell { background:#fafafe; border:1px solid rgba(99,102,241,0.08); border-radius:10px; padding:10px 12px; }
.adr-meta-label { font-size:9.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.6px; color:#9ca3af; margin-bottom:3px; }
.adr-meta-value { font-size:13px; font-weight:600; color:#1e1b4b; }
.adr-billing-card { padding:14px 16px; border-radius:14px; border:1.5px solid; }
.adr-notes-box { background:#fafafe; border:1px solid rgba(99,102,241,0.1); border-radius:12px; padding:14px 16px; font-size:13.5px; color:#374151; line-height:1.65; font-weight:500; font-style:italic; }
.adr-history-item { display:flex; gap:12px; padding:10px 0; border-bottom:1px solid rgba(99,102,241,0.06); }
.adr-history-item:last-child { border-bottom:none; }
.adr-history-dot { width:8px; height:8px; border-radius:50%; background:#a5b4fc; margin-top:5px; flex-shrink:0; }
.adr-history-diag { font-size:13px; font-weight:700; color:#1e1b4b; margin-bottom:2px; }
.adr-history-sub { font-size:11.5px; color:#6b7280; font-weight:500; }
.adr-prev-appt { display:flex; align-items:center; gap:10px; padding:8px 0; border-bottom:1px solid rgba(99,102,241,0.06); }
.adr-prev-appt:last-child { border-bottom:none; }
.adr-prev-date { font-size:12px; font-weight:700; color:#1e1b4b; width:90px; flex-shrink:0; }
.adr-prev-notes { font-size:12px; color:#6b7280; font-weight:500; flex:1; }
.adr-empty-sub { font-size:12px; color:#a5b4fc; font-weight:500; text-align:center; padding:12px 0; }
.adr-footer { padding:16px 24px; border-top:1px solid rgba(99,102,241,0.1); display:flex; gap:8px; flex-shrink:0; background:white; }
.adr-btn { flex:1; padding:11px; border-radius:11px; font-size:13px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif; cursor:pointer; transition:all 0.2s; border:none; }
.adr-btn-edit { background:linear-gradient(135deg,#6366f1,#4f46e5); color:white; box-shadow:0 3px 10px rgba(99,102,241,0.3); }
.adr-btn-edit:hover { transform:translateY(-1px); box-shadow:0 6px 16px rgba(99,102,241,0.35); }
.adr-btn-delete { background:rgba(239,68,68,0.08); color:#dc2626; border:1.5px solid rgba(239,68,68,0.2); flex:0 0 auto; padding:11px 18px; }
.adr-btn-delete:hover { background:rgba(239,68,68,0.14); }
.adr-loading { display:flex; align-items:center; justify-content:center; height:200px; flex-direction:column; gap:12px; }
.adr-spinner { width:32px; height:32px; border:3px solid rgba(99,102,241,0.15); border-top-color:#6366f1; border-radius:50%; animation:adr-spin 0.8s linear infinite; }
@keyframes adr-spin { to{transform:rotate(360deg)} }
`;

const STATUS = {
  Pending:   { bg:'rgba(245,158,11,0.1)',  color:'#d97706', border:'rgba(245,158,11,0.3)',  dot:'#f59e0b'  },
  Confirmed: { bg:'rgba(99,102,241,0.1)',  color:'#4f46e5', border:'rgba(99,102,241,0.3)',  dot:'#6366f1'  },
  Completed: { bg:'rgba(16,185,129,0.1)', color:'#059669', border:'rgba(16,185,129,0.3)', dot:'#10b981'  },
  Cancelled: { bg:'rgba(239,68,68,0.1)',  color:'#dc2626', border:'rgba(239,68,68,0.3)',  dot:'#ef4444'  },
};

function fmt12(t) {
  if (!t) return null;
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

function Badge({ status }) {
  const s = STATUS[status] || STATUS.Pending;
  return (
    <span className="adr-badge" style={{ background:s.bg, color:s.color, borderColor:s.border }}>
      <span className="adr-badge-dot" style={{ background:s.dot }} />{status}
    </span>
  );
}

export default function AppointmentDrawer({ appointmentId, onClose, onEdit, onDelete }) {
  const [appt, setAppt]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);
const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    if (!appointmentId) return;
    setLoading(true);
    fetch(`/api/appointments/${appointmentId}`)
      .then(r => r.json())
      .then(data => { setAppt(data); setLoading(false); });
  }, [appointmentId]);

  const close = () => {
    setClosing(true);
    setTimeout(onClose, 200);
  };

  // Close on Escape key
  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  if (!appointmentId) return null;

  const dateObj   = appt ? new Date(appt.appointment_date) : null;
  const billingOk = appt?.billing_status === 'Paid';

  return (
    <>
      <style>{CSS}</style>
      <div className={`adr-overlay${closing ? ' closing' : ''}`} onClick={e => { if (e.target === e.currentTarget) close(); }}>
        <div className="adr-drawer">
          <div className="adr-top-bar" />

          {/* Header */}
          <div className="adr-header">
            <div className="adr-header-left">
              <div>
                <div className="adr-header-title">Appointment Details</div>
                <div className="adr-header-sub">#{appointmentId} · Click outside to close</div>
              </div>
            </div>
            <button className="adr-close" onClick={close}>✕</button>
          </div>

          <div className="adr-body">
            {loading ? (
              <div className="adr-loading">
                <div className="adr-spinner" />
                <span style={{ fontSize:13, color:'#9ca3af', fontWeight:600 }}>Loading details...</span>
              </div>
            ) : appt?.error ? (
              <div style={{ padding:24, color:'#dc2626', fontSize:14 }}>⚠️ {appt.error}</div>
            ) : appt && (
              <>
                {/* Hero — Date + Status */}
                <div className="adr-hero">
                  <div className="adr-appt-id">Appointment #{appt.id}</div>
                  <div className="adr-date-row">
                    <div className="adr-date-block">
                      <div className="adr-date-day">{dateObj.getDate()}</div>
                      <div className="adr-date-month">
                        {dateObj.toLocaleString('default', { month:'short' })}
                      </div>
                    </div>
                    <div className="adr-date-info">
                      <div className="adr-date-full">
                        {dateObj.toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
                      </div>
                      {appt.appointment_time ? (
                        <span className="adr-time-badge">⏰ {fmt12(appt.appointment_time?.slice(0,5))}</span>
                      ) : (
                        <span style={{ fontSize:12, color:'#9ca3af', fontStyle:'italic' }}>No time assigned</span>
                      )}
                    </div>
                  </div>
                  <div className="adr-status-row">
                    <Badge status={appt.status} />
                    {appt.billing_id && (
                      <span className="adr-badge" style={{
                        background: billingOk ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                        color:      billingOk ? '#059669' : '#d97706',
                        borderColor:billingOk ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)',
                      }}>
                        <span className="adr-badge-dot" style={{ background: billingOk ? '#10b981' : '#f59e0b' }} />
                        {billingOk ? 'Paid' : 'Bill Pending'} · ₹{Number(appt.amount||0).toLocaleString('en-IN')}
                      </span>
                    )}
                    <span style={{ fontSize:11, color:'#a5b4fc', fontWeight:500, marginLeft:'auto' }}>
                      Booked {new Date(appt.created_at).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                {appt.notes && (
                  <div className="adr-section">
                    <div className="adr-sec-title"><span className="adr-sec-icon">📝</span>Visit Notes</div>
                    <div className="adr-notes-box">"{appt.notes}"</div>
                  </div>
                )}

                {/* Patient */}
                <div className="adr-section">
                  <div className="adr-sec-title"><span className="adr-sec-icon">👤</span>Patient Information</div>
                  <div className="adr-person-card">
                    <div className="adr-person-avatar" style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                      {(appt.patient_name||'?')[0].toUpperCase()}
                    </div>
                    <div style={{ flex:1 }}>
                      <div className="adr-person-name">{appt.patient_name || '—'}</div>
                      <div className="adr-person-sub">
                        {appt.age && `Age ${appt.age}`}
                        {appt.gender && ` · ${appt.gender}`}
                        {appt.blood_group && <> · <b>🩸 {appt.blood_group}</b></>}
                      </div>
                    </div>
                  </div>
                  <div className="adr-meta-grid">
                    <div className="adr-meta-cell">
                      <div className="adr-meta-label">Diagnosis</div>
                      <div className="adr-meta-value">{appt.disease || '—'}</div>
                    </div>
                    <div className="adr-meta-cell">
                      <div className="adr-meta-label">Phone</div>
                      <div className="adr-meta-value">{appt.patient_phone || '—'}</div>
                    </div>
                    <div className="adr-meta-cell">
                      <div className="adr-meta-label">Email</div>
                      <div className="adr-meta-value" style={{ fontSize:12 }}>{appt.patient_email || '—'}</div>
                    </div>
                    <div className="adr-meta-cell">
                      <div className="adr-meta-label">Address</div>
                      <div className="adr-meta-value" style={{ fontSize:11 }}>{appt.address || '—'}</div>
                    </div>
                  </div>
                </div>

                {/* Doctor */}
                <div className="adr-section">
                  <div className="adr-sec-title"><span className="adr-sec-icon">🩺</span>Doctor Information</div>
                  <div className="adr-person-card">
                    <div className="adr-person-avatar" style={{ background:'linear-gradient(135deg,#0891b2,#06b6d4)' }}>
                      {(appt.doctor_name||'?').replace(/Dr\.?\s*/i,'').trim()[0]?.toUpperCase() || 'D'}
                    </div>
                    <div style={{ flex:1 }}>
                      <div className="adr-person-name">{appt.doctor_name || '—'}</div>
                      <div className="adr-person-sub">
                        {appt.specialization}
                        {appt.qualification && ` · ${appt.qualification}`}
                      </div>
                    </div>
                    {appt.fee && (
                      <div style={{ textAlign:'right', flexShrink:0 }}>
                        <div style={{ fontSize:16, fontWeight:800, color:'#1e1b4b' }}>₹{Number(appt.fee).toLocaleString('en-IN')}</div>
                        <div style={{ fontSize:10, color:'#9ca3af', fontWeight:600 }}>CONSULT FEE</div>
                      </div>
                    )}
                  </div>
                  <div className="adr-meta-grid">
                    <div className="adr-meta-cell">
                      <div className="adr-meta-label">Phone</div>
                      <div className="adr-meta-value">{appt.doctor_phone || '—'}</div>
                    </div>
                    <div className="adr-meta-cell">
                      <div className="adr-meta-label">Experience</div>
                      <div className="adr-meta-value">{appt.experience ? `${appt.experience} yrs` : '—'}</div>
                    </div>
                  </div>
                </div>

                {/* Billing */}
                {appt.billing_id && (
                  <div className="adr-section">
                    <div className="adr-sec-title"><span className="adr-sec-icon">💰</span>Billing</div>
                    <div className="adr-billing-card" style={{
                      borderColor: billingOk ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)',
                      background:  billingOk ? 'rgba(16,185,129,0.04)' : 'rgba(245,158,11,0.04)',
                    }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        <div>
                          <div style={{ fontSize:20, fontWeight:800, color:'#1e1b4b' }}>
                            ₹{Number(appt.amount||0).toLocaleString('en-IN')}
                          </div>
                          <div style={{ fontSize:11, color:'#9ca3af', fontWeight:600, marginTop:2 }}>
                            {appt.billed_at && `Billed on ${new Date(appt.billed_at).toLocaleDateString('en-IN')}`}
                          </div>
                        </div>
                        <span className="adr-badge" style={{
                          background:  billingOk ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                          color:       billingOk ? '#059669' : '#d97706',
                          borderColor: billingOk ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)',
                          fontSize: 13,
                        }}>
                          <span className="adr-badge-dot" style={{ background: billingOk ? '#10b981' : '#f59e0b' }} />
                          {appt.billing_status}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Medical history */}
                <div className="adr-section">
                  <div className="adr-sec-title"><span className="adr-sec-icon">🏥</span>Patient Medical History</div>
                  {(appt.patient_history||[]).length === 0 ? (
                    <div className="adr-empty-sub">No previous medical history found</div>
                  ) : (
                    (appt.patient_history||[]).map((h, i) => (
                      <div key={i} className="adr-history-item">
                        <div className="adr-history-dot" />
                        <div>
                          <div className="adr-history-diag">{h.diagnosis}</div>
                          <div className="adr-history-sub">
                            {h.treatment && `Tx: ${h.treatment} · `}
                            Dr. {h.doctor_name} · {new Date(h.visit_date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                          </div>
                          {h.notes && <div style={{ fontSize:11.5, color:'#9ca3af', marginTop:2 }}>{h.notes}</div>}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Previous appointments with same doctor */}
                <div className="adr-section">
                  <div className="adr-sec-title"><span className="adr-sec-icon">📋</span>Previous Visits with this Doctor</div>
                  {(appt.previous_appointments||[]).length === 0 ? (
                    <div className="adr-empty-sub">First visit with this doctor</div>
                  ) : (
                    (appt.previous_appointments||[]).map(p => {
                      const s = STATUS[p.status] || STATUS.Pending;
                      return (
                        <div key={p.id} className="adr-prev-appt">
                          <div className="adr-prev-date">
                            {new Date(p.appointment_date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                          </div>
                          <div className="adr-prev-notes">{p.notes || 'No notes'}</div>
                          <span className="adr-badge" style={{ background:s.bg, color:s.color, borderColor:s.border, fontSize:10.5, flexShrink:0 }}>
                            <span className="adr-badge-dot" style={{ background:s.dot }} />{p.status}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </div>

         {/* // Update the footer buttons section: */}
{appt && !appt.error && (
  <div className="adr-footer">
    <button className="adr-btn adr-btn-edit" onClick={() => { close(); onEdit(appt); }}>
      ✏️ Edit
    </button>
    <button
      className="adr-btn"
      style={{ background:'rgba(6,182,212,0.1)', color:'#0891b2', border:'1.5px solid rgba(6,182,212,0.25)', flex:'0 0 auto', padding:'11px 16px' }}
      onClick={() => setShowReceipt(true)}
    >
      🧾 Receipt
    </button>
    <button className="adr-btn adr-btn-delete" onClick={() => { close(); onDelete(appt.id); }}>
      🗑
    </button>
  </div>
)}

{/* Receipt modal */}
{showReceipt && (
  <AppointmentReceipt
    appointmentId={appointmentId}
    onClose={() => setShowReceipt(false)}
  />
)}
        </div>
      </div>
    </>
  );
}