'use client';
import { useState, useRef } from 'react';
import QRCode from 'qrcode';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
.pdv * { box-sizing: border-box; }
.pdv { font-family: 'Plus Jakarta Sans', sans-serif; max-width: 960px; margin: 0 auto; padding: 24px; }

/* Hero card */
.pdv-hero { background: white; border-radius: 20px; border: 1px solid rgba(99,102,241,0.1); box-shadow: 0 4px 24px rgba(99,102,241,0.07); margin-bottom: 20px; overflow: hidden; }
.pdv-hero-banner { height: 80px; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #0891b2 100%); position: relative; }
.pdv-hero-body { padding: 0 24px 22px; display: flex; align-items: flex-end; gap: 18px; flex-wrap: wrap; }
.pdv-avatar { width: 70px; height: 70px; border-radius: 18px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; font-size: 24px; font-weight: 800; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 16px rgba(99,102,241,0.35); margin-top: -35px; flex-shrink: 0; }
.pdv-hero-info { flex: 1; padding-top: 12px; min-width: 200px; }
.pdv-patient-name { font-size: 22px; font-weight: 800; color: #1e1b4b; letter-spacing: -0.4px; margin-bottom: 4px; }
.pdv-patient-meta { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; font-size: 12px; }
.pdv-meta-badge { border-radius: 100px; padding: 3px 10px; font-size: 12px; font-weight: 700; }
.pdv-meta-badge-id  { background: rgba(99,102,241,0.1); color: #4f46e5; }
.pdv-meta-badge-info { background: rgba(6,182,212,0.1); color: #0891b2; }
.pdv-active-badge { font-size: 11px; padding: 3px 10px; border-radius: 99px; background: rgba(16,185,129,0.1); color: #059669; border: 1px solid rgba(16,185,129,0.25); font-weight: 700; }

/* Stat bar */
.pdv-stat-bar { display: grid; grid-template-columns: repeat(4,1fr); background: #fafafe; border-top: 1px solid rgba(99,102,241,0.08); }
.pdv-stat-cell { padding: 14px 20px; text-align: center; border-right: 1px solid rgba(99,102,241,0.07); }
.pdv-stat-cell:last-child { border-right: none; }
.pdv-stat-val { font-size: 20px; font-weight: 800; color: #1e1b4b; letter-spacing: -0.5px; }
.pdv-stat-lbl { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px; color: #9ca3af; margin-top: 2px; }

/* Tabs */
.pdv-tabs { display: flex; gap: 4px; background: white; border-radius: 20px; border: 1px solid rgba(99,102,241,0.1); box-shadow: 0 4px 20px rgba(99,102,241,0.06); padding: 6px; margin-bottom: 20px; overflow-x: auto; }
.pdv-tab { flex: 1; padding: 9px 12px; border: none; border-radius: 13px; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 600; color: #6b7280; background: transparent; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px; white-space: nowrap; }
.pdv-tab:hover:not(.active) { background: rgba(99,102,241,0.06); color: #4f46e5; }
.pdv-tab.active { background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; box-shadow: 0 3px 10px rgba(99,102,241,0.3); }

/* Panel */
.pdv-panel { background: white; border-radius: 20px; border: 1px solid rgba(99,102,241,0.1); box-shadow: 0 4px 24px rgba(99,102,241,0.06); padding: 24px; animation: pdv-in 0.25s ease; }
@keyframes pdv-in { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }

/* Section header */
.pdv-sec-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.pdv-sec-title { font-size: 15px; font-weight: 700; color: #1e1b4b; display: flex; align-items: center; gap: 8px; }
.pdv-sec-dot { width: 7px; height: 7px; border-radius: 50%; background: linear-gradient(135deg,#6366f1,#8b5cf6); flex-shrink: 0; }

/* Buttons */
.pdv-add-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 10px; border: 1.5px solid rgba(99,102,241,0.25); background: rgba(99,102,241,0.06); color: #4f46e5; font-size: 13px; font-weight: 700; font-family: 'Plus Jakarta Sans',sans-serif; cursor: pointer; transition: all 0.2s; }
.pdv-add-btn:hover { background: rgba(99,102,241,0.12); transform: translateY(-1px); }
.pdv-save-btn { padding: 9px 20px; background: linear-gradient(135deg,#6366f1,#4f46e5); color: white; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; font-family: 'Plus Jakarta Sans',sans-serif; cursor: pointer; box-shadow: 0 3px 10px rgba(99,102,241,0.3); transition: all 0.2s; }
.pdv-save-btn:hover { transform: translateY(-1px); }
.pdv-cancel-btn { padding: 9px 20px; background: transparent; color: #6b7280; border: 1.5px solid rgba(107,114,128,0.25); border-radius: 10px; font-size: 13px; font-weight: 700; font-family: 'Plus Jakarta Sans',sans-serif; cursor: pointer; transition: all 0.2s; }
.pdv-cancel-btn:hover { background: rgba(107,114,128,0.06); }

/* Form */
.pdv-form { background: #fafafe; border: 1.5px solid rgba(99,102,241,0.15); border-radius: 16px; padding: 20px; margin-bottom: 20px; }
.pdv-form-title { font-size: 14px; font-weight: 700; color: #1e1b4b; margin-bottom: 16px; }
.pdv-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
.pdv-field label { display: block; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px; color: #6366f1; margin-bottom: 5px; }
.pdv-input, .pdv-textarea { width: 100%; padding: 9px 13px; border: 1.5px solid rgba(99,102,241,0.18); border-radius: 10px; font-size: 13.5px; font-family: 'Plus Jakarta Sans',sans-serif; font-weight: 500; color: #1e1b4b; background: white; outline: none; transition: all 0.2s; }
.pdv-input:focus, .pdv-textarea:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
.pdv-textarea { resize: vertical; }
.pdv-form-actions { display: flex; gap: 8px; }

/* Info grid */
.pdv-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.pdv-info-cell { background: #fafafe; border: 1px solid rgba(99,102,241,0.08); border-radius: 12px; padding: 14px 16px; transition: border-color 0.2s; }
.pdv-info-cell:hover { border-color: rgba(99,102,241,0.2); }
.pdv-info-label { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px; color: #9ca3af; margin-bottom: 5px; }
.pdv-info-value { font-size: 14px; font-weight: 600; color: #1e1b4b; }

/* Timeline */
.pdv-timeline { position: relative; padding-left: 28px; }
.pdv-timeline-line { position: absolute; left: 8px; top: 0; bottom: 0; width: 1px; background: rgba(99,102,241,0.15); }
.pdv-timeline-item { position: relative; margin-bottom: 20px; }
.pdv-timeline-dot { position: absolute; left: -24px; top: 12px; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white; }
.pdv-timeline-card { background: white; border: 1px solid rgba(99,102,241,0.1); border-radius: 14px; padding: 14px 16px; transition: border-color 0.2s; }
.pdv-timeline-card:hover { border-color: rgba(99,102,241,0.2); }
.pdv-timeline-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
.pdv-timeline-diagnosis { font-size: 13px; font-weight: 700; color: #1e1b4b; }
.pdv-timeline-date { font-size: 11px; color: #9ca3af; font-weight: 600; }
.pdv-timeline-treatment { margin: 0 0 4px; font-size: 13px; color: #6b7280; font-weight: 500; }
.pdv-timeline-doctor { margin: 0 0 4px; font-size: 12px; color: #a5b4fc; font-weight: 600; }
.pdv-timeline-notes { margin: 8px 0 0; font-size: 12px; color: #6b7280; border-top: 1px solid rgba(99,102,241,0.08); padding-top: 8px; }

/* Insurance card */
.pdv-insurance-card { background: white; border: 1px solid rgba(99,102,241,0.1); border-radius: 14px; padding: 16px; margin-bottom: 12px; transition: border-color 0.2s; }
.pdv-insurance-card:hover { border-color: rgba(99,102,241,0.2); }
.pdv-insurance-top { display: flex; justify-content: space-between; align-items: flex-start; }
.pdv-insurance-provider { font-weight: 700; font-size: 14px; color: #1e1b4b; margin-bottom: 4px; }
.pdv-insurance-policy { font-size: 12px; color: #6b7280; font-weight: 500; }
.pdv-insurance-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; }
.pdv-insurance-cell { background: #fafafe; border-radius: 8px; padding: 10px 12px; border: 1px solid rgba(99,102,241,0.07); }
.pdv-insurance-cell-label { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px; color: #9ca3af; margin-bottom: 4px; }
.pdv-insurance-cell-value { font-size: 14px; font-weight: 700; color: #1e1b4b; }

/* Badge */
.pdv-badge { display: inline-flex; align-items: center; gap: 5px; border-radius: 100px; padding: 3px 10px; font-size: 11.5px; font-weight: 700; border: 1px solid; }
.pdv-badge-dot { width: 6px; height: 6px; border-radius: 50%; }

/* Appointment row */
.pdv-appt-row { display: flex; align-items: center; gap: 14px; padding: 14px 16px; background: #fafafe; border: 1px solid rgba(99,102,241,0.08); border-radius: 14px; margin-bottom: 10px; transition: all 0.2s; }
.pdv-appt-row:hover { border-color: rgba(99,102,241,0.2); background: white; }
@media(max-width:768px){
  .pdv{padding:16px;}
  .pdv-hero-body{padding:0 16px 18px;gap:12px;}
  .pdv-stat-bar{grid-template-columns:repeat(2,1fr);}
  .pdv-stat-cell{padding:10px 12px;}
  .pdv-stat-val{font-size:17px;}
  .pdv-tabs{padding:4px;gap:2px;}
  .pdv-tab{padding:8px 8px;font-size:12px;gap:3px;}
  .pdv-panel{padding:18px 14px;}
  .pdv-form-grid{grid-template-columns:1fr;}
  .pdv-info-grid{grid-template-columns:1fr 1fr;}
  .pdv-patient-name{font-size:18px;}
  .pdv-sec-header{flex-wrap:wrap;gap:10px;}
  .pdv-add-btn{font-size:12px;padding:7px 12px;}
}
@media(max-width:480px){
  .pdv{padding:10px;}
  .pdv-info-grid{grid-template-columns:1fr;}
  .pdv-tabs{overflow-x:auto;-webkit-overflow-scrolling:touch;}
  .pdv-tab{flex-shrink:0;font-size:11px;padding:8px 10px;}
  .pdv-form-actions{flex-wrap:wrap;}
  .pdv-save-btn,.pdv-cancel-btn{flex:1;text-align:center;}
  .pdv-id-card{width:100%!important;}
  .pdv-appt-row{flex-wrap:wrap;gap:8px;}
  .pdv-timeline-header{flex-direction:column;gap:4px;}
}

.pdv-appt-date-box { width: 48px; height: 48px; background: linear-gradient(135deg,#6366f1,#4f46e5); border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 3px 8px rgba(99,102,241,0.3); flex-shrink: 0; }
.pdv-appt-date-day { font-size: 17px; font-weight: 800; color: white; line-height: 1; }
.pdv-appt-date-mon { font-size: 10px; color: rgba(255,255,255,0.8); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.pdv-appt-doctor { font-size: 14px; font-weight: 700; color: #1e1b4b; margin-bottom: 2px; }
.pdv-appt-spec { font-size: 12px; color: #6b7280; font-weight: 500; }

/* Empty state */
.pdv-empty { text-align: center; padding: 40px 20px; }
.pdv-empty-icon { font-size: 36px; margin-bottom: 10px; }
.pdv-empty-text { font-size: 14px; font-weight: 600; color: #a5b4fc; }

/* ID Card */
.pdv-id-card { width: 340px; background: white; border: 1px solid rgba(99,102,241,0.15); border-radius: 20px; overflow: hidden; box-shadow: 0 8px 32px rgba(99,102,241,0.12); }
.pdv-id-banner { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #0891b2 100%); padding: 20px; }
.pdv-id-banner-sub { font-size: 11px; opacity: 0.7; margin-bottom: 4px; letter-spacing: 0.08em; color: white; font-weight: 700; text-transform: uppercase; }
.pdv-id-banner-title { font-size: 16px; font-weight: 800; color: white; }
.pdv-id-body { padding: 20px; display: flex; gap: 16px; align-items: flex-start; }
.pdv-id-name { font-size: 18px; font-weight: 800; color: #1e1b4b; margin-bottom: 6px; }
.pdv-id-field { font-size: 12px; color: #6b7280; font-weight: 500; margin-bottom: 2px; }
.pdv-id-field span { font-weight: 700; color: #374151; }
.pdv-id-footer { border-top: 1px solid rgba(99,102,241,0.1); padding: 12px 20px; font-size: 11px; color: #9ca3af; display: flex; justify-content: space-between; font-weight: 600; }
`;

const STATUS_STYLE = {
  Pending:   { bg: 'rgba(245,158,11,0.1)',  color: '#d97706', border: 'rgba(245,158,11,0.25)',  dot: '#f59e0b' },
  Confirmed: { bg: 'rgba(99,102,241,0.1)',  color: '#4f46e5', border: 'rgba(99,102,241,0.25)',  dot: '#6366f1' },
  Completed: { bg: 'rgba(16,185,129,0.1)',  color: '#059669', border: 'rgba(16,185,129,0.25)',  dot: '#10b981' },
  Cancelled: { bg: 'rgba(239,68,68,0.1)',   color: '#dc2626', border: 'rgba(239,68,68,0.25)',   dot: '#ef4444' },
};

function Badge({ status }) {
  const s = STATUS_STYLE[status] || { bg: 'rgba(107,114,128,0.1)', color: '#4b5563', border: 'rgba(107,114,128,0.2)', dot: '#6b7280' };
  return (
    <span className="pdv-badge" style={{ background: s.bg, color: s.color, borderColor: s.border }}>
      <span className="pdv-badge-dot" style={{ background: s.dot }} />{status}
    </span>
  );
}

export default function PatientDetailView({ patient, onUpdate }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddHistory, setShowAddHistory] = useState(false);
  const [showAddInsurance, setShowAddInsurance] = useState(false);
  const [historyForm, setHistoryForm] = useState({ diagnosis: '', treatment: '', doctor_name: '', visit_date: '', notes: '' });
  const [insuranceForm, setInsuranceForm] = useState({ provider: '', policy_number: '', expiry_date: '', coverage_amount: '', status: 'Active' });
  const qrRef = useRef(null);

  const tabs = [
    { key: 'overview',     label: 'Overview',     icon: '🧾' },
    { key: 'history',      label: 'History',      icon: '📋' },
    { key: 'insurance',    label: 'Insurance',    icon: '🛡️' },
    { key: 'appointments', label: 'Appointments', icon: '📅' },
    { key: 'id-card',      label: 'ID Card',      icon: '🪪' },
  ];

  const generateQR = async () => {
    const data = JSON.stringify({ id: patient.id, name: patient.name, blood_group: patient.blood_group });
    const url = await QRCode.toDataURL(data, { width: 200, margin: 1 });
    if (qrRef.current) qrRef.current.src = url;
  };

const submitHistory = async () => {
  console.log("SENDING DATA:", historyForm); // 👈 debug

  if (!historyForm.visit_date) {
    alert("Visit date is required");
    return;
  }

  const res = await fetch(`/api/patients/${patient.id}/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...historyForm,
      visit_date: historyForm.visit_date || new Date().toISOString().split('T')[0]
    }),
  });

  const data = await res.json();
  console.log("RESPONSE:", data);

  if (!res.ok) {
    alert(data.error || "Something went wrong");
    return;
  }

  setShowAddHistory(false);
  setHistoryForm({
    diagnosis: '',
    treatment: '',
    doctor_name: '',
    visit_date: '',
    notes: ''
  });

  onUpdate();
};

const submitInsurance = async () => {
  console.log("INSURANCE DATA:", insuranceForm);

  if (!insuranceForm.provider || !insuranceForm.policy_number) {
    alert("Provider and Policy Number are required");
    return;
  }

  const res = await fetch(`/api/patients/${patient.id}/insurance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: insuranceForm.provider,
      policy_number: insuranceForm.policy_number,
      expiry_date: insuranceForm.expiry_date || null,        // ✅ FIX
      coverage_amount: insuranceForm.coverage_amount
        ? Number(insuranceForm.coverage_amount)             // ✅ FIX
        : null,
      status: insuranceForm.status || "Active"
    }),
  });

  const data = await res.json();
  console.log("RESPONSE:", data);

  if (!res.ok) {
    alert(data.error);
    return;
  }

  setShowAddInsurance(false);
  setInsuranceForm({
    provider: '',
    policy_number: '',
    expiry_date: '',
    coverage_amount: '',
    status: 'Active'
  });

  onUpdate();
};

  const initials = (patient.name || 'P').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <>
      <style>{CSS}</style>
      <div className="pdv">

        {/* ── Hero ───────────────────────────────────── */}
        <div className="pdv-hero">
          <div className="pdv-hero-banner" />
          <div className="pdv-hero-body">
            <div className="pdv-avatar">{initials}</div>
            <div className="pdv-hero-info">
              <div className="pdv-patient-name">{patient.name}</div>
              <div className="pdv-patient-meta">
                <span className="pdv-meta-badge pdv-meta-badge-id">#{patient.id}</span>
                <span className="pdv-meta-badge pdv-meta-badge-info">🩸 {patient.blood_group || 'N/A'}</span>
                <span className="pdv-meta-badge pdv-meta-badge-info">Age {patient.age}</span>
                {patient.gender && patient.gender !== 'N/A' && (
                  <span className="pdv-meta-badge pdv-meta-badge-info">{patient.gender}</span>
                )}
              </div>
            </div>
            <div style={{ marginLeft: 'auto', paddingTop: 12 }}>
              <span className="pdv-active-badge">● Active</span>
            </div>
          </div>
          <div className="pdv-stat-bar">
            {[
              [patient.age || '—',                        'Age'],
              [patient.blood_group || '—',                'Blood Group'],
              [(patient.history || []).length,            'Visits'],
              [(patient.appointments || []).length,       'Appointments'],
            ].map(([val, lbl]) => (
              <div key={lbl} className="pdv-stat-cell">
                <div className="pdv-stat-val">{val}</div>
                <div className="pdv-stat-lbl">{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tabs ───────────────────────────────────── */}
        <div className="pdv-tabs">
          {tabs.map(t => (
            <button
              key={t.key}
              className={`pdv-tab${activeTab === t.key ? ' active' : ''}`}
              onClick={() => { setActiveTab(t.key); if (t.key === 'id-card') setTimeout(generateQR, 100); }}
            >
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* ── Overview ───────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="pdv-panel">
            <div className="pdv-sec-header">
              <div className="pdv-sec-title"><div className="pdv-sec-dot" />Patient Information</div>
            </div>
            <div className="pdv-info-grid">
              {[
                ['📛 Full Name',          patient.name],
                ['🎂 Age',               patient.age],
                ['⚧ Gender',             patient.gender || '—'],
                ['🩸 Blood Group',        patient.blood_group || '—'],
                ['📞 Phone',             patient.phone || '—'],
                ['📧 Email',             patient.email || '—'],
                ['📍 Address',           patient.address || '—'],
                ['🩺 Primary Diagnosis', patient.disease],
              ].map(([label, value]) => (
                <div key={label} className="pdv-info-cell">
                  <div className="pdv-info-label">{label}</div>
                  <div className="pdv-info-value">{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── History ────────────────────────────────── */}
        {activeTab === 'history' && (
          <div className="pdv-panel">
            <div className="pdv-sec-header">
              <div className="pdv-sec-title"><div className="pdv-sec-dot" />Medical History</div>
              <button className="pdv-add-btn" onClick={() => setShowAddHistory(true)}>+ Add entry</button>
            </div>

            {showAddHistory && (
              <div className="pdv-form">
                <div className="pdv-form-title">📋 New History Entry</div>
                <div className="pdv-form-grid">
                  {[
                    ['Diagnosis',   'diagnosis',   'text'],
                    ['Treatment',   'treatment',   'text'],
                    ['Doctor Name', 'doctor_name', 'text'],
                    ['Visit Date',  'visit_date',  'date'],
                  ].map(([label, key, type]) => (
                    <div key={key} className="pdv-field">
                      <label>{label}</label>
                      <input type={type} className="pdv-input" value={historyForm[key]}
                        onChange={e => setHistoryForm(f => ({ ...f, [key]: e.target.value }))} />
                    </div>
                  ))}
                </div>
                <div className="pdv-field" style={{ marginBottom: 12 }}>
                  <label>Notes</label>
                  <textarea className="pdv-textarea" rows={3} value={historyForm.notes}
                    onChange={e => setHistoryForm(f => ({ ...f, notes: e.target.value }))} />
                </div>
                <div className="pdv-form-actions">
                  <button className="pdv-save-btn" onClick={submitHistory}>Save</button>
                  <button className="pdv-cancel-btn" onClick={() => setShowAddHistory(false)}>Cancel</button>
                </div>
              </div>
            )}

            {(patient.history || []).length === 0 && !showAddHistory ? (
              <div className="pdv-empty">
                <div className="pdv-empty-icon">📋</div>
                <div className="pdv-empty-text">No history entries yet</div>
              </div>
            ) : (
              <div className="pdv-timeline">
                <div className="pdv-timeline-line" />
                {(patient.history || []).map((h, i) => (
                  <div key={h.id} className="pdv-timeline-item">
                    <div className="pdv-timeline-dot"
                      style={{ background: i === 0 ? '#6366f1' : '#d1d5db' }} />
                    <div className="pdv-timeline-card">
                      <div className="pdv-timeline-header">
                        <span className="pdv-timeline-diagnosis">{h.diagnosis}</span>
                        <span className="pdv-timeline-date">
                          {new Date(h.visit_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <p className="pdv-timeline-treatment">Treatment: {h.treatment}</p>
                      <p className="pdv-timeline-doctor">Dr. {h.doctor_name}</p>
                      {h.notes && <p className="pdv-timeline-notes">{h.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Insurance ──────────────────────────────── */}
        {activeTab === 'insurance' && (
          <div className="pdv-panel">
            <div className="pdv-sec-header">
              <div className="pdv-sec-title"><div className="pdv-sec-dot" />Insurance Information</div>
              <button className="pdv-add-btn" onClick={() => setShowAddInsurance(true)}>+ Add policy</button>
            </div>

            {showAddInsurance && (
              <div className="pdv-form">
                <div className="pdv-form-title">🛡️ New Insurance Policy</div>
                <div className="pdv-form-grid">
                  {[
                    ['Provider',             'provider',         'text'],
                    ['Policy Number',        'policy_number',    'text'],
                    ['Expiry Date',          'expiry_date',      'date'],
                    ['Coverage Amount (₹)',  'coverage_amount',  'number'],
                  ].map(([label, key, type]) => (
                    <div key={key} className="pdv-field">
                      <label>{label}</label>
                      <input type={type} className="pdv-input" value={insuranceForm[key]}
                        onChange={e => setInsuranceForm(f => ({ ...f, [key]: e.target.value }))} />
                    </div>
                  ))}
                </div>
                <div className="pdv-form-actions">
                  <button className="pdv-save-btn" onClick={submitInsurance}>Save</button>
                  <button className="pdv-cancel-btn" onClick={() => setShowAddInsurance(false)}>Cancel</button>
                </div>
              </div>
            )}

            {(patient.insurance || []).length === 0 && !showAddInsurance ? (
              <div className="pdv-empty">
                <div className="pdv-empty-icon">🛡️</div>
                <div className="pdv-empty-text">No insurance records added yet</div>
              </div>
            ) : (
              (patient.insurance || []).map(ins => (
                <div key={ins.id} className="pdv-insurance-card">
                  <div className="pdv-insurance-top">
                    <div>
                      <div className="pdv-insurance-provider">{ins.provider}</div>
                      <div className="pdv-insurance-policy">Policy: {ins.policy_number}</div>
                    </div>
                    <Badge status={ins.status || 'Active'} />
                  </div>
                  <div className="pdv-insurance-grid">
                    <div className="pdv-insurance-cell">
                      <div className="pdv-insurance-cell-label">Coverage</div>
                      <div className="pdv-insurance-cell-value">₹{Number(ins.coverage_amount).toLocaleString('en-IN')}</div>
                    </div>
                    <div className="pdv-insurance-cell">
                      <div className="pdv-insurance-cell-label">Expiry</div>
                      <div className="pdv-insurance-cell-value">
                        {new Date(ins.expiry_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Appointments ───────────────────────────── */}
        {activeTab === 'appointments' && (
          <div className="pdv-panel">
            <div className="pdv-sec-header">
              <div className="pdv-sec-title">
                <div className="pdv-sec-dot" />Appointment History
                {(patient.appointments || []).length > 0 && (
                  <span style={{ background: 'rgba(99,102,241,0.1)', color: '#4f46e5', borderRadius: '100px', padding: '1px 9px', fontSize: 12, fontWeight: 700 }}>
                    {(patient.appointments || []).length}
                  </span>
                )}
              </div>
            </div>
            {(patient.appointments || []).length === 0 ? (
              <div className="pdv-empty">
                <div className="pdv-empty-icon">📅</div>
                <div className="pdv-empty-text">No appointments found</div>
              </div>
            ) : (
              (patient.appointments || []).map(a => (
                <div key={a.id} className="pdv-appt-row">
                  <div className="pdv-appt-date-box">
                    <div className="pdv-appt-date-day">{new Date(a.appointment_date).getDate()}</div>
                    <div className="pdv-appt-date-mon">{new Date(a.appointment_date).toLocaleString('default', { month: 'short' })}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="pdv-appt-doctor">{a.doctor_name}</div>
                    <div className="pdv-appt-spec">{a.specialization}</div>
                  </div>
                  <Badge status={a.status} />
                </div>
              ))
            )}
          </div>
        )}

        {/* ── ID Card ────────────────────────────────── */}
        {activeTab === 'id-card' && (
          <div className="pdv-panel" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="pdv-id-card">
              <div className="pdv-id-banner">
                <div className="pdv-id-banner-sub">Hospital Management System</div>
                <div className="pdv-id-banner-title">Patient ID Card</div>
              </div>
              <div className="pdv-id-body">
                <div style={{ flex: 1 }}>
                  <div className="pdv-id-name">{patient.name}</div>
                  <div className="pdv-id-field">ID: <span>#{String(patient.id).padStart(6, '0')}</span></div>
                  <div className="pdv-id-field">Age: <span>{patient.age}</span> · <span>{patient.gender || 'N/A'}</span></div>
                  <div className="pdv-id-field">Blood: <span>{patient.blood_group || 'N/A'}</span></div>
                  <div className="pdv-id-field">Dx: <span>{patient.disease}</span></div>
                </div>
                <div>
                  <img ref={qrRef} alt="QR Code" style={{ width: 80, height: 80, borderRadius: 8, border: '1px solid rgba(99,102,241,0.15)' }} />
                </div>
              </div>
              <div className="pdv-id-footer">
                <span>Issued: {new Date().toLocaleDateString('en-IN')}</span>
                <span>{patient.phone || 'Phone N/A'}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}