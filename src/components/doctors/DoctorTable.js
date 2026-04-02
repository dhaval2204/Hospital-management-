"use client";

const specialColors = [
  { bg: "rgba(99,102,241,0.1)",  color: "#4f46e5" },
  { bg: "rgba(16,185,129,0.1)",  color: "#059669" },
  { bg: "rgba(245,158,11,0.1)",  color: "#d97706" },
  { bg: "rgba(6,182,212,0.1)",   color: "#0891b2" },
  { bg: "rgba(239,68,68,0.1)",   color: "#dc2626" },
  { bg: "rgba(139,92,246,0.1)",  color: "#7c3aed" },
];

function getSpecialStyle(name = "") {
  const idx = name.charCodeAt(0) % specialColors.length;
  return specialColors[idx];
}

export default function DoctorTable({ doctors, onEdit, onDelete }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .dt-wrap {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(99,102,241,0.1);
          box-shadow: 0 4px 24px rgba(99,102,241,0.06);
        }
        .dt-table { width: 100%; border-collapse: collapse; }
        .dt-table thead { background: linear-gradient(135deg, #f5f3ff, #ede9fe); }
        .dt-table th {
          padding: 14px 18px;
          text-align: left;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #6366f1;
        }
        .dt-table td {
          padding: 13px 18px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          border-top: 1px solid rgba(99,102,241,0.06);
          vertical-align: middle;
        }
        .dt-row:hover td { background: rgba(99,102,241,0.025); }
        .dt-avatar {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
          font-weight: 700;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-right: 10px;
          box-shadow: 0 3px 8px rgba(79,70,229,0.3);
          vertical-align: middle;
          flex-shrink: 0;
        }
        .dt-name {
          font-weight: 700;
          color: #1e1b4b;
          vertical-align: middle;
        }
        .dt-name-wrap {
          display: inline-flex;
          align-items: center;
        }
        .dt-special {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          border-radius: 100px;
          padding: 3px 11px;
          font-size: 12px;
          font-weight: 700;
        }
        .dt-phone {
          font-family: monospace;
          color: #4b5563;
          font-size: 13px;
          font-weight: 600;
        }
        .dt-exp {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(16,185,129,0.1);
          color: #059669;
          border-radius: 100px;
          padding: 3px 10px;
          font-size: 12px;
          font-weight: 700;
          border: 1px solid rgba(16,185,129,0.2);
        }
        .dt-btn {
          border: none;
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          margin-right: 6px;
        }
        .dt-btn-edit {
          background: rgba(245,158,11,0.1);
          color: #d97706;
          border: 1px solid rgba(245,158,11,0.2);
        }
        .dt-btn-edit:hover {
          background: rgba(245,158,11,0.18);
          transform: translateY(-1px);
        }
        .dt-btn-delete {
          background: rgba(239,68,68,0.1);
          color: #dc2626;
          border: 1px solid rgba(239,68,68,0.2);
        }
        .dt-btn-delete:hover {
          background: rgba(239,68,68,0.18);
          transform: translateY(-1px);
        }

@media (max-width: 768px) {
  .dt-wrap { border-radius: 14px; }
  .dt-table th, .dt-table td { padding: 10px 12px; font-size: 12px; }
  .dt-avatar { width: 30px; height: 30px; font-size: 12px; border-radius: 8px; }
  .dt-btn { padding: 5px 10px; font-size: 11px; }
}
@media (max-width: 480px) {
  .dt-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .dt-table { min-width: 520px; }
}
        .dt-empty {
          text-align: center;
          padding: 48px 0;
          color: #a5b4fc;
          font-size: 14px;
          font-weight: 500;
        }
      `}</style>

      <div className="dt-wrap">
        <table className="dt-table">
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Specialization</th>
              <th>Phone</th>
              <th>Experience</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length > 0 ? doctors.map((d) => {
              const sc = getSpecialStyle(d.specialization);
              return (
                <tr key={d.id} className="dt-row">
                  <td>
                    <div className="dt-name-wrap">
                      <div className="dt-avatar">{d.name?.[0]?.toUpperCase()}</div>
                      <span className="dt-name">{d.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="dt-special" style={{ background: sc.bg, color: sc.color }}>
                      🩺 {d.specialization}
                    </span>
                  </td>
                  <td><span className="dt-phone">📞 {d.phone}</span></td>
                  <td><span className="dt-exp">⭐ {d.experience} yrs</span></td>
                  <td>
                    <button className="dt-btn dt-btn-edit" onClick={() => onEdit(d)}>✏️ Edit</button>
                    <button className="dt-btn dt-btn-delete" onClick={() => onDelete(d.id)}>🗑 Delete</button>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={5}>
                  <div className="dt-empty">👨‍⚕️ No doctors found</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}