'use client';
import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
.rcpt-overlay { position:fixed; inset:0; background:rgba(15,10,40,0.5); z-index:2000; display:flex; align-items:center; justify-content:center; padding:20px; animation:rcpt-in 0.2s ease; }
@keyframes rcpt-in { from{opacity:0} to{opacity:1} }
.rcpt-modal { background:white; border-radius:20px; width:min(700px,100%); max-height:90vh; overflow-y:auto; font-family:'Plus Jakarta Sans',sans-serif; box-shadow:0 24px 80px rgba(0,0,0,0.25); }
.rcpt-modal::-webkit-scrollbar { width:4px; }
.rcpt-modal::-webkit-scrollbar-thumb { background:rgba(99,102,241,0.2); border-radius:2px; }
.rcpt-toolbar { display:flex; align-items:center; justify-content:space-between; padding:16px 24px; border-bottom:1px solid rgba(99,102,241,0.1); position:sticky; top:0; background:white; z-index:1; border-radius:20px 20px 0 0; }
.rcpt-toolbar-title { font-size:15px; font-weight:700; color:#1e1b4b; }
.rcpt-toolbar-actions { display:flex; gap:8px; }
.rcpt-btn { display:inline-flex; align-items:center; gap:6px; padding:8px 16px; border-radius:10px; font-size:13px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif; cursor:pointer; transition:all 0.2s; border:none; }
.rcpt-btn-print { background:linear-gradient(135deg,#6366f1,#4f46e5); color:white; box-shadow:0 3px 10px rgba(99,102,241,0.3); }
.rcpt-btn-print:hover { transform:translateY(-1px); }
.rcpt-btn-close { background:rgba(107,114,128,0.1); color:#6b7280; border:1.5px solid rgba(107,114,128,0.2) !important; }
.rcpt-btn-close:hover { background:rgba(239,68,68,0.08); color:#dc2626; }
.rcpt-doc { padding:32px; }
.rcpt-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:28px; padding-bottom:20px; border-bottom:2px solid #f5f3ff; }
.rcpt-hospital { display:flex; align-items:center; gap:12px; }
.rcpt-hospital-logo { width:48px; height:48px; border-radius:13px; background:linear-gradient(135deg,#6366f1,#8b5cf6); display:flex; align-items:center; justify-content:center; color:white; font-size:20px; font-weight:800; flex-shrink:0; }
.rcpt-hospital-name { font-size:18px; font-weight:800; color:#1e1b4b; letter-spacing:-0.4px; }
.rcpt-hospital-sub { font-size:11.5px; color:#9ca3af; font-weight:500; margin-top:1px; }
.rcpt-receipt-info { text-align:right; }
.rcpt-receipt-id { font-size:13px; font-weight:700; color:#4f46e5; background:rgba(99,102,241,0.08); padding:4px 12px; border-radius:100px; display:inline-block; margin-bottom:4px; }
.rcpt-receipt-date { font-size:11.5px; color:#9ca3af; font-weight:500; }
.rcpt-appt-banner { background:linear-gradient(135deg,#4f46e5,#7c3aed); border-radius:16px; padding:20px 24px; margin-bottom:24px; display:flex; align-items:center; justify-content:space-between; gap:16px; }
.rcpt-appt-date-block { display:flex; align-items:center; gap:14px; }
.rcpt-cal { background:rgba(255,255,255,0.15); border-radius:12px; padding:10px 14px; text-align:center; color:white; min-width:58px; }
.rcpt-cal-day { font-size:26px; font-weight:800; line-height:1; }
.rcpt-cal-month { font-size:10px; font-weight:700; letter-spacing:0.5px; opacity:0.85; text-transform:uppercase; }
.rcpt-appt-details { color:white; }
.rcpt-appt-label { font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; opacity:0.7; margin-bottom:4px; }
.rcpt-appt-time { font-size:20px; font-weight:800; letter-spacing:-0.3px; }
.rcpt-appt-notes { font-size:12px; opacity:0.8; margin-top:3px; }
.rcpt-status-pill { background:rgba(255,255,255,0.2); border:1.5px solid rgba(255,255,255,0.3); border-radius:100px; padding:6px 16px; color:white; font-size:12px; font-weight:700; display:flex; align-items:center; gap:6px; flex-shrink:0; }
.rcpt-status-dot { width:7px; height:7px; border-radius:50%; background:white; }
.rcpt-two-col { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px; }
.rcpt-card { background:#fafafe; border:1px solid rgba(99,102,241,0.1); border-radius:14px; padding:16px; }
.rcpt-card-title { font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:#a5b4fc; margin-bottom:12px; display:flex; align-items:center; gap:6px; }
.rcpt-card-icon { font-size:13px; }
.rcpt-person-row { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
.rcpt-avatar { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:800; color:white; flex-shrink:0; }
.rcpt-person-name { font-size:14px; font-weight:800; color:#1e1b4b; }
.rcpt-person-role { font-size:11px; color:#9ca3af; font-weight:500; }
.rcpt-detail-row { display:flex; justify-content:space-between; padding:5px 0; border-bottom:1px solid rgba(99,102,241,0.05); font-size:12.5px; }
.rcpt-detail-row:last-child { border-bottom:none; }
.rcpt-detail-label { color:#9ca3af; font-weight:600; }
.rcpt-detail-value { color:#1e1b4b; font-weight:700; text-align:right; max-width:60%; }
.rcpt-billing-row { display:flex; align-items:center; justify-content:space-between; padding:14px 16px; background:white; border:1.5px solid rgba(99,102,241,0.12); border-radius:12px; margin-bottom:20px; }
.rcpt-billing-label { font-size:13px; font-weight:700; color:#1e1b4b; }
.rcpt-billing-sub { font-size:11px; color:#9ca3af; font-weight:500; margin-top:1px; }
.rcpt-billing-amount { font-size:22px; font-weight:800; color:#1e1b4b; letter-spacing:-0.5px; }
.rcpt-billing-status { display:inline-flex; align-items:center; gap:5px; border-radius:100px; padding:3px 10px; font-size:11px; font-weight:700; border:1px solid; }
.rcpt-qr-section { display:flex; align-items:center; gap:20px; padding:18px; background:#fafafe; border:1px solid rgba(99,102,241,0.1); border-radius:14px; margin-bottom:20px; }
.rcpt-qr-canvas { border-radius:10px; border:1px solid rgba(99,102,241,0.15); }
.rcpt-qr-info { flex:1; }
.rcpt-qr-title { font-size:13px; font-weight:700; color:#1e1b4b; margin-bottom:4px; }
.rcpt-qr-sub { font-size:12px; color:#6b7280; font-weight:500; line-height:1.5; }
.rcpt-footer { text-align:center; padding-top:16px; border-top:1px dashed rgba(99,102,241,0.15); }
.rcpt-footer-text { font-size:11.5px; color:#a5b4fc; font-weight:600; margin-bottom:4px; }
.rcpt-footer-small { font-size:10px; color:#d1d5db; font-weight:500; }

@media(max-width:640px){
  .rcpt-modal{border-radius:14px;}
  .rcpt-toolbar{flex-wrap:wrap;gap:8px;padding:12px 16px;}
  .rcpt-toolbar-actions{width:100%;display:flex;gap:8px;}
  .rcpt-toolbar-actions .rcpt-btn{flex:1;justify-content:center;}
  .rcpt-doc{padding:20px 16px;}
  .rcpt-header{flex-direction:column;gap:14px;align-items:flex-start;}
  .rcpt-receipt-info{text-align:left;}
  .rcpt-two-col{grid-template-columns:1fr;}
  .rcpt-appt-banner{flex-direction:column;gap:12px;padding:16px;}
  .rcpt-status-pill{align-self:flex-start;}
  .rcpt-qr-section{flex-direction:column;align-items:flex-start;}
  .rcpt-billing-row{flex-direction:column;gap:10px;align-items:flex-start;}
}

@media print {
  .rcpt-overlay { position:static; background:none; padding:0; }
  .rcpt-modal { box-shadow:none; border-radius:0; max-height:none; }
  .rcpt-toolbar { display:none; }
  .rcpt-doc { padding:16px; }
}
`;

function fmt12(t) {
  if (!t) return 'Time not set';
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

export default function AppointmentReceipt({ appointmentId, onClose }) {
  const [appt, setAppt]   = useState(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!appointmentId) return;
    fetch(`/api/appointments/${appointmentId}/receipt`)
      .then(r => r.json())
      .then(data => { setAppt(data); setLoading(false); });
  }, [appointmentId]);

  // Generate QR code after data loads
  useEffect(() => {
    if (!appt || !canvasRef.current) return;
    const qrData = JSON.stringify({
      receipt:  `APPT-${String(appt.id).padStart(6,'0')}`,
      patient:  appt.patient_name,
      doctor:   appt.doctor_name,
      date:     appt.appointment_date?.split('T')[0] || appt.appointment_date,
      time:     appt.appointment_time?.slice(0,5) || 'N/A',
      hospital: 'MediCore HMS',
    });
    QRCode.toCanvas(canvasRef.current, qrData, {
      width: 110, margin: 1,
      color: { dark:'#1e1b4b', light:'#fafafe' },
    });
  }, [appt]);

  const handlePrint = () => window.print();

  const dateObj = appt?.appointment_date ? new Date(appt.appointment_date) : null;
  const billingOk = appt?.billing_status === 'Paid';

  return (
    <>
      <style>{CSS}</style>
      <div className="rcpt-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="rcpt-modal">
          {/* Toolbar */}
          <div className="rcpt-toolbar">
            <span className="rcpt-toolbar-title">🧾 Appointment Receipt</span>
            <div className="rcpt-toolbar-actions">
              <button className="rcpt-btn rcpt-btn-print" onClick={handlePrint}>🖨️ Print / Save PDF</button>
              <button className="rcpt-btn rcpt-btn-close" onClick={onClose}>✕ Close</button>
            </div>
          </div>

          {loading ? (
            <div style={{ padding:60, textAlign:'center', color:'#a5b4fc', fontSize:14, fontFamily:'Plus Jakarta Sans,sans-serif' }}>
              <div style={{ width:32, height:32, border:'3px solid rgba(99,102,241,0.15)', borderTopColor:'#6366f1', borderRadius:'50%', animation:'rcpt-spin 0.8s linear infinite', margin:'0 auto 12px' }} />
              <style>{`@keyframes rcpt-spin{to{transform:rotate(360deg)}}`}</style>
              Generating receipt...
            </div>
          ) : appt && (
            <div className="rcpt-doc" id="receipt-print-area">

              {/* Hospital header */}
              <div className="rcpt-header">
                <div className="rcpt-hospital">
                  <div className="rcpt-hospital-logo">M</div>
                  <div>
                    <div className="rcpt-hospital-name">MediCore HMS</div>
                    <div className="rcpt-hospital-sub">Hospital Management System · Ahmedabad, Gujarat</div>
                  </div>
                </div>
                <div className="rcpt-receipt-info">
                  <div className="rcpt-receipt-id">#{`APPT-${String(appt.id).padStart(6,'0')}`}</div>
                  <div className="rcpt-receipt-date">
                    Issued: {new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}
                  </div>
                </div>
              </div>

              {/* Appointment banner */}
              <div className="rcpt-appt-banner">
                <div className="rcpt-appt-date-block">
                  {dateObj && (
                    <div className="rcpt-cal">
                      <div className="rcpt-cal-day">{dateObj.getDate()}</div>
                      <div className="rcpt-cal-month">
                        {dateObj.toLocaleString('default', { month:'short' })} {dateObj.getFullYear()}
                      </div>
                    </div>
                  )}
                  <div className="rcpt-appt-details">
                    <div className="rcpt-appt-label">Appointment Time</div>
                    <div className="rcpt-appt-time">
                      {fmt12(appt.appointment_time?.slice(0,5))}
                    </div>
                    {dateObj && (
                      <div className="rcpt-appt-notes">
                        {dateObj.toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
                      </div>
                    )}
                  </div>
                </div>
                <div className="rcpt-status-pill">
                  <div className="rcpt-status-dot" />
                  {appt.status}
                </div>
              </div>

              {/* Patient + Doctor cards */}
              <div className="rcpt-two-col">
                {/* Patient */}
                <div className="rcpt-card">
                  <div className="rcpt-card-title">
                    <span className="rcpt-card-icon">👤</span>Patient
                  </div>
                  <div className="rcpt-person-row">
                    <div className="rcpt-avatar" style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                      {(appt.patient_name||'P')[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="rcpt-person-name">{appt.patient_name}</div>
                      <div className="rcpt-person-role">Patient</div>
                    </div>
                  </div>
                  {[
                    ['Age',         appt.age ? `${appt.age} years` : '—'],
                    ['Gender',      appt.gender || '—'],
                    ['Blood Group', appt.blood_group || '—'],
                    ['Phone',       appt.patient_phone || '—'],
                    ['Diagnosis',   appt.disease || '—'],
                  ].map(([label, value]) => (
                    <div key={label} className="rcpt-detail-row">
                      <span className="rcpt-detail-label">{label}</span>
                      <span className="rcpt-detail-value">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Doctor */}
                <div className="rcpt-card">
                  <div className="rcpt-card-title">
                    <span className="rcpt-card-icon">🩺</span>Doctor
                  </div>
                  <div className="rcpt-person-row">
                    <div className="rcpt-avatar" style={{ background:'linear-gradient(135deg,#0891b2,#06b6d4)' }}>
                      {(appt.doctor_name||'D').replace(/Dr\.?\s*/i,'').trim()[0]?.toUpperCase() || 'D'}
                    </div>
                    <div>
                      <div className="rcpt-person-name">{appt.doctor_name}</div>
                      <div className="rcpt-person-role">{appt.specialization}</div>
                    </div>
                  </div>
                  {[
                    ['Qualification', appt.qualification || '—'],
                    ['Experience',    appt.experience ? `${appt.experience} years` : '—'],
                    ['Phone',         appt.doctor_phone || '—'],
                    ['Email',         appt.doctor_email || '—'],
                    ['Consult Fee',   appt.fee ? `₹${Number(appt.fee).toLocaleString('en-IN')}` : '—'],
                  ].map(([label, value]) => (
                    <div key={label} className="rcpt-detail-row">
                      <span className="rcpt-detail-label">{label}</span>
                      <span className="rcpt-detail-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {appt.notes && (
                <div style={{ background:'rgba(99,102,241,0.04)', border:'1px solid rgba(99,102,241,0.1)', borderRadius:12, padding:'12px 16px', marginBottom:16, fontSize:13, color:'#374151', fontStyle:'italic', lineHeight:1.6 }}>
                  <span style={{ fontWeight:700, fontStyle:'normal', color:'#4f46e5' }}>📝 Visit Notes: </span>
                  {appt.notes}
                </div>
              )}

              {/* Billing */}
              <div className="rcpt-billing-row">
                <div>
                  <div className="rcpt-billing-label">Consultation Fee</div>
                  <div className="rcpt-billing-sub">
                    {appt.billing_status ? 'Auto-billed on completion' : 'Fee at time of visit'}
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div className="rcpt-billing-amount">₹{Number(appt.fee||0).toLocaleString('en-IN')}</div>
                  {appt.billing_status && (
                    <span className="rcpt-billing-status" style={{
                      background:  billingOk ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                      color:       billingOk ? '#059669' : '#d97706',
                      borderColor: billingOk ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)',
                    }}>
                      {billingOk ? '✓ Paid' : '⏳ Pending'}
                    </span>
                  )}
                </div>
              </div>

              {/* QR Code */}
              <div className="rcpt-qr-section">
                <canvas ref={canvasRef} className="rcpt-qr-canvas" />
                <div className="rcpt-qr-info">
                  <div className="rcpt-qr-title">Appointment QR Code</div>
                  <div className="rcpt-qr-sub">
                    Scan this QR code at reception for instant check-in. Contains appointment ID, patient name, doctor, date and time slot.
                  </div>
                  <div style={{ marginTop:8, fontSize:11, color:'#a5b4fc', fontWeight:600 }}>
                    ID: {`APPT-${String(appt.id).padStart(6,'0')}`}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="rcpt-footer">
                <div className="rcpt-footer-text">MediCore HMS · Thank you for choosing our hospital</div>
                <div className="rcpt-footer-small">
                  Please arrive 10 minutes before your scheduled time · Carry this receipt and a valid ID
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}