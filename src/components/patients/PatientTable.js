"use client";
import { useRouter } from "next/navigation";
export default function PatientTable({ patients, onEdit, onDelete }) {

  const router = useRouter();
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .pt-wrap {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(99,102,241,0.1);
          box-shadow: 0 4px 24px rgba(99,102,241,0.06);
        }
        .pt-table {
          width: 100%;
          border-collapse: collapse;
        }
        .pt-table thead {
          background: linear-gradient(135deg, #f5f3ff, #ede9fe);
        }
        .pt-table th {
          padding: 14px 18px;
          text-align: left;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #6366f1;
        }
        .pt-table td {
          padding: 14px 18px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          border-top: 1px solid rgba(99,102,241,0.06);
          vertical-align: middle;
        }
        .pt-row {
          transition: background 0.15s ease;
        }
        .pt-row:hover td {
          background: rgba(99,102,241,0.03);
        }
        .pt-avatar {
          width: 34px; height: 34px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          font-weight: 700;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-right: 10px;
          box-shadow: 0 3px 8px rgba(99,102,241,0.3);
          vertical-align: middle;
        }
        .pt-name {
          font-weight: 700;
          color: #1e1b4b;
          vertical-align: middle;
        }
        .pt-disease {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(99,102,241,0.08);
          color: #4f46e5;
          border-radius: 100px;
          padding: 3px 10px;
          font-size: 12px;
          font-weight: 600;
        }
        .pt-age {
          font-weight: 700;
          color: #374151;
        }
        .pt-btn {
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
        .pt-btn-edit {
          background: rgba(245,158,11,0.1);
          color: #d97706;
          border: 1px solid rgba(245,158,11,0.2);
        }
        .pt-btn-edit:hover {
          background: rgba(245,158,11,0.18);
          transform: translateY(-1px);
        }
        .pt-btn-delete {
          background: rgba(239,68,68,0.1);
          color: #dc2626;
          border: 1px solid rgba(239,68,68,0.2);
        }
        .pt-btn-delete:hover {
          background: rgba(239,68,68,0.18);
          transform: translateY(-1px);
        }
        .pt-empty {
          text-align: center;
          padding: 48px 0;
          color: #a5b4fc;
          font-size: 14px;
          font-weight: 500;
        }
        .pt-empty-icon {
          font-size: 36px;
          margin-bottom: 10px;
        }
      `}</style>

      <div className="pt-wrap">
        <table className="pt-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Age</th>
              <th>Condition</th>
                {/* ✅ NEW HEADERS */}
              <th>Blood</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Gender</th>

              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.length > 0 ? patients.map((p) => (
              <tr key={p.id} className="pt-row">
                <td>
                  <span className="pt-avatar">{p.name?.[0]?.toUpperCase()}</span>
                  <span className="pt-name">{p.name}</span>
                </td>
                <td><span className="pt-age">{p.age} yrs</span></td>
                <td><span className="pt-disease">🩺 {p.disease}</span></td>
                  {/* ✅ NEW DATA */}
                <td>{p.blood_group}</td>
                <td>{p.phone}</td>
                <td>{p.email}</td>
                <td>{p.gender}</td>
                <td>
                  <button className="pt-btn pt-btn-edit" onClick={() => onEdit(p)}>✏️ Edit</button>
                  <button className="pt-btn pt-btn-delete" onClick={() => onDelete(p.id)}>🗑 Delete</button>
                   <button className="pt-btn pt-btn-delete" onClick={() => router.push(`/patients/${p.id}`)}>
              View
            </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4}>
                  <div className="pt-empty">
                    <div className="pt-empty-icon">🏥</div>
                    No patients found
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}