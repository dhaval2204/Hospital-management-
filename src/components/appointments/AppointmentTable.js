'use client';

function formatTime12(time24) {
  if (!time24) return null;
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
}
const statusStyles = {
  Pending: { bg: 'rgba(245,158,11,0.1)', color: '#d97706', border: 'rgba(245,158,11,0.25)', dot: '#f59e0b' },
  Confirmed: { bg: 'rgba(99,102,241,0.1)', color: '#4f46e5', border: 'rgba(99,102,241,0.25)', dot: '#6366f1' },
  Completed: { bg: 'rgba(16,185,129,0.1)', color: '#059669', border: 'rgba(16,185,129,0.25)', dot: '#10b981' },
  Cancelled: { bg: 'rgba(239,68,68,0.1)', color: '#dc2626', border: 'rgba(239,68,68,0.25)', dot: '#ef4444' },
};
export default function AppointmentTable({ data, onEdit, onDelete, onRowClick }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .at-wrap{font-family:'Plus Jakarta Sans',sans-serif;background:white;border-radius:20px;overflow:hidden;border:1px solid rgba(99,102,241,0.1);box-shadow:0 4px 24px rgba(99,102,241,0.06);}
        .at-table{width:100%;border-collapse:collapse;}
        .at-table thead{background:linear-gradient(135deg,#f5f3ff,#ede9fe);}
        .at-table th{padding:14px 18px;text-align:left;font-size:10.5px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#6366f1;}
        .at-table td{padding:13px 18px;font-size:14px;font-weight:500;color:#374151;border-top:1px solid rgba(99,102,241,0.06);vertical-align:middle;}
        .at-row:hover td{background:rgba(99,102,241,0.025);}
        .at-name{font-weight:700;color:#1e1b4b;}
        .at-doctor{color:#6366f1;font-weight:600;}
        .at-date{font-weight:700;color:#1e1b4b;font-size:13px;}
        .at-time{font-size:11.5px;font-weight:700;color:#6366f1;background:rgba(99,102,241,0.08);padding:2px 8px;border-radius:100px;display:inline-block;width:fit-content;margin-top:3px;}
        .at-no-time{font-size:11px;color:#d1d5db;font-style:italic;}
        .status-badge{display:inline-flex;align-items:center;gap:5px;border-radius:100px;padding:4px 10px;font-size:11.5px;font-weight:700;border:1px solid;}
        .status-dot{width:6px;height:6px;border-radius:50%;}
        .at-btn{border:none;padding:7px 13px;border-radius:8px;font-size:12px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;transition:all 0.2s;margin-right:5px;}
        .at-btn-edit{background:rgba(245,158,11,0.1);color:#d97706;border:1px solid rgba(245,158,11,0.2);}
        .at-btn-edit:hover{background:rgba(245,158,11,0.18);transform:translateY(-1px);}
        .at-btn-delete{background:rgba(239,68,68,0.1);color:#dc2626;border:1px solid rgba(239,68,68,0.2);}
        .at-btn-delete:hover{background:rgba(239,68,68,0.18);transform:translateY(-1px);}
        .at-empty{text-align:center;padding:48px 0;color:#a5b4fc;font-size:14px;font-weight:500;}
        .at-notes-chip{font-size:11px;color:#6b7280;background:rgba(107,114,128,0.08);border-radius:6px;padding:2px 7px;margin-top:3px;display:inline-block;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
      `}</style>
      <div className="at-wrap">
        <table className="at-table">
          <thead><tr><th>Patient</th><th>Doctor</th><th>Date & Time</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {data.length > 0 ? data.map(a => {
              const s = statusStyles[a.status] || statusStyles.Pending;
              const timeStr = formatTime12(a.appointment_time);
              return (
                // Change the <tr> to be clickable — replace just the tr line:
<tr
  key={a.id}
  className="at-row"
  onClick={() => onRowClick(a.id)}
  style={{ cursor:'pointer' }}
>
                  <td><div className="at-name">👤 {a.patient_name}</div>{a.notes && <div className="at-notes-chip" title={a.notes}>📝 {a.notes}</div>}</td>
                  <td><span className="at-doctor">🩺 {a.doctor_name}</span></td>
                  <td><div className="at-date">{new Date(a.appointment_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>{timeStr ? <span className="at-time">⏰ {timeStr}</span> : <span className="at-no-time">No time set</span>}</td>
                  <td><span className="status-badge" style={{ background: s.bg, color: s.color, borderColor: s.border }}><span className="status-dot" style={{ background: s.dot }} />{a.status}</span></td>
                  <td><button className="at-btn at-btn-edit" onClick={() => onEdit(a)}>✏️ Edit</button><button className="at-btn at-btn-delete" onClick={() => onDelete(a.id)}>🗑 Delete</button></td>
                </tr>
              );
            }) : <tr><td colSpan={5} className="at-empty">📅 No appointments found</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}