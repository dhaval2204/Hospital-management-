'use client';
import { useEffect, useState } from 'react';
import SlotPicker from '@/components/appointments/SlotPicker';

export default function AppointmentForm({ form, setForm, onSubmit, editId }) {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/patients').then(r => r.json()).then(setPatients);
    fetch('/api/doctors').then(r => r.json()).then(setDoctors);
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    await onSubmit();
    setSubmitting(false);
  };

  const today = new Date().toISOString().split('T')[0];
  const selectedDoctor = doctors.find(d => String(d.id) === String(form.doctor_id));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .af-card { font-family:'Plus Jakarta Sans',sans-serif; background:white; border-radius:20px; padding:28px; margin-bottom:24px; border:1px solid rgba(99,102,241,0.1); box-shadow:0 4px 24px rgba(99,102,241,0.06); position:relative; overflow:hidden; }
        .af-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,#6366f1,#8b5cf6,#06b6d4); }
        .af-title { font-size:16px; font-weight:700; color:#1e1b4b; margin-bottom:20px; display:flex; align-items:center; gap:8px; }
        .af-title-dot { width:8px; height:8px; border-radius:50%; background:linear-gradient(135deg,#6366f1,#8b5cf6); }
        .af-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .af-field label { display:block; font-size:11px; font-weight:700; letter-spacing:0.7px; text-transform:uppercase; color:#6366f1; margin-bottom:6px; }
        .af-select, .af-input { width:100%; padding:10px 14px; border:1.5px solid rgba(99,102,241,0.18); border-radius:11px; font-size:14px; font-family:'Plus Jakarta Sans',sans-serif; font-weight:500; color:#1e1b4b; background:#fafafe; transition:all 0.2s; outline:none; box-sizing:border-box; appearance:none; }
        .af-select:focus, .af-input:focus { border-color:#6366f1; background:white; box-shadow:0 0 0 4px rgba(99,102,241,0.1); }
        .af-select:disabled, .af-input:disabled { opacity:0.55; cursor:not-allowed; }
        .af-doctor-preview { display:flex; align-items:center; gap:10px; padding:11px 14px; background:rgba(99,102,241,0.04); border:1.5px solid rgba(99,102,241,0.15); border-radius:11px; margin-top:12px; }
        .af-doc-avatar { width:32px; height:32px; border-radius:9px; background:linear-gradient(135deg,#6366f1,#8b5cf6); color:white; font-size:12px; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .af-doc-name { font-size:13.5px; font-weight:700; color:#1e1b4b; }
        .af-doc-spec { font-size:11.5px; color:#6366f1; font-weight:500; }
        .af-divider { height:1px; background:rgba(99,102,241,0.08); margin:20px 0; }
        .af-step { display:flex; align-items:center; gap:8px; margin-bottom:14px; }
        .af-step-num { width:22px; height:22px; border-radius:50%; background:linear-gradient(135deg,#6366f1,#4f46e5); color:white; font-size:11px; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .af-step-label { font-size:13px; font-weight:700; color:#1e1b4b; }
        .af-warning { display:flex; align-items:center; gap:8px; padding:10px 14px; background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.2); border-radius:10px; font-size:12.5px; font-weight:600; color:#d97706; margin-top:12px; }
        .af-status-row { display:flex; gap:8px; flex-wrap:wrap; }
        .af-status-btn { padding:7px 16px; border-radius:100px; border:1.5px solid; font-size:12px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif; cursor:pointer; transition:all 0.18s; background:transparent; }
        .af-notes { width:100%; padding:10px 14px; border:1.5px solid rgba(99,102,241,0.18); border-radius:11px; font-size:14px; font-family:'Plus Jakarta Sans',sans-serif; font-weight:500; color:#1e1b4b; background:#fafafe; outline:none; resize:vertical; box-sizing:border-box; transition:all 0.2s; }
        .af-notes:focus { border-color:#6366f1; background:white; box-shadow:0 0 0 4px rgba(99,102,241,0.1); }
        .af-submit { background:linear-gradient(135deg,#6366f1,#4f46e5); color:white; border:none; padding:12px 28px; border-radius:12px; font-size:14px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif; cursor:pointer; transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1); box-shadow:0 4px 14px rgba(99,102,241,0.35); display:flex; align-items:center; gap:8px; }
        .af-submit:hover:not(:disabled) { transform:translateY(-2px) scale(1.02); box-shadow:0 8px 20px rgba(99,102,241,0.4); }
        .af-submit:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
        .af-submit-spin { width:14px; height:14px; border:2px solid rgba(255,255,255,0.3); border-top-color:white; border-radius:50%; animation:af-spin 0.7s linear infinite; }
        @keyframes af-spin { to { transform:rotate(360deg); } }
      `}</style>

      <div className="af-card">
        <div className="af-title"><div className="af-title-dot"/>{editId ? '✏️ Edit Appointment' : '📅 Book New Appointment'}</div>

        {/* Step 1 */}
        <div className="af-step"><div className="af-step-num">1</div><div className="af-step-label">Select Patient & Doctor</div></div>
        <div className="af-grid" style={{marginBottom:0}}>
          <div className="af-field">
            <label>Patient</label>
            <select className="af-select" value={form.patient_id} onChange={e=>setForm({...form,patient_id:e.target.value})}>
              <option value="">— Select Patient —</option>
              {patients.map(p=><option key={p.id} value={p.id}>{p.name} (Age {p.age})</option>)}
            </select>
          </div>
          <div className="af-field">
            <label>Doctor</label>
            <select className="af-select" value={form.doctor_id} onChange={e=>setForm({...form,doctor_id:e.target.value,appointment_time:''})}>
              <option value="">— Select Doctor —</option>
              {doctors.map(d=><option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>)}
            </select>
          </div>
        </div>
        {selectedDoctor && (
          <div className="af-doctor-preview">
            <div className="af-doc-avatar">{selectedDoctor.name[0]}</div>
            <div><div className="af-doc-name">{selectedDoctor.name}</div><div className="af-doc-spec">🩺 {selectedDoctor.specialization} · ₹{selectedDoctor.fee||0} fee</div></div>
          </div>
        )}

        <div className="af-divider"/>

        {/* Step 2 */}
        <div className="af-step"><div className="af-step-num">2</div><div className="af-step-label">Pick a Date</div></div>
        <div className="af-field" style={{maxWidth:260}}>
          <label>Appointment Date</label>
          <input type="date" className="af-input" min={today} value={form.appointment_date||''} disabled={!form.doctor_id} onChange={e=>setForm({...form,appointment_date:e.target.value,appointment_time:''})}/>
        </div>
        {!form.doctor_id && <div className="af-warning">⚠️ Select a doctor first to enable date picking</div>}

        {/* Step 3 — Slot Picker */}
        {form.doctor_id && form.appointment_date && (
          <>
            <div className="af-divider"/>
            <div className="af-step"><div className="af-step-num">3</div><div className="af-step-label">Choose a Time Slot</div></div>
            <SlotPicker
              doctorId={form.doctor_id}
              date={form.appointment_date}
              selectedSlot={form.appointment_time||''}
              onSelect={slot=>setForm(f=>({...f,appointment_time:slot}))}
            />
          </>
        )}

        {/* Step 4 — Status + Notes + Submit */}
        {(form.appointment_time || (editId && form.appointment_date)) && (
          <>
            <div className="af-divider"/>
            <div className="af-step"><div className="af-step-num">4</div><div className="af-step-label">Status & Notes</div></div>
            <div className="af-field" style={{marginBottom:12}}>
              <label>Status</label>
              <div className="af-status-row">
                {[
                  {s:'Pending',   bg:'rgba(245,158,11,0.15)',  border:'rgba(245,158,11,0.4)',  color:'#d97706'},
                  {s:'Confirmed', bg:'rgba(99,102,241,0.15)',  border:'rgba(99,102,241,0.4)',  color:'#4f46e5'},
                  {s:'Completed', bg:'rgba(16,185,129,0.15)',  border:'rgba(16,185,129,0.4)',  color:'#059669'},
                  {s:'Cancelled', bg:'rgba(239,68,68,0.15)',   border:'rgba(239,68,68,0.4)',   color:'#dc2626'},
                ].map(({s,bg,border,color})=>{
                  const sel = form.status===s;
                  return <button key={s} className="af-status-btn" style={{background:sel?bg:'transparent',borderColor:sel?border:'rgba(99,102,241,0.15)',color:sel?color:'#9ca3af'}} onClick={()=>setForm(f=>({...f,status:s}))}>{s}</button>;
                })}
              </div>
            </div>
            <div className="af-field" style={{marginBottom:18}}>
              <label>Notes / Reason for visit</label>
              <textarea className="af-notes" rows={2} placeholder="e.g. Chest pain since 2 days, follow-up..." value={form.notes||''} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/>
            </div>
            <button className="af-submit" onClick={handleSubmit} disabled={submitting||!form.patient_id||!form.doctor_id||!form.appointment_date}>
              {submitting?<><div className="af-submit-spin"/>Booking...</>:<>{editId?'✓ Update Appointment':'✓ Book Appointment'}</>}
            </button>
          </>
        )}
      </div>
    </>
  );
}