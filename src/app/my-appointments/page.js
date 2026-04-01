"use client";

import { useEffect, useState } from "react";

const statusStyles = {
  Pending:   { bg: "rgba(245,158,11,0.1)",  color: "#d97706", border: "rgba(245,158,11,0.25)", dot: "#f59e0b" },
  Approved:  { bg: "rgba(99,102,241,0.1)",   color: "#4f46e5", border: "rgba(99,102,241,0.25)", dot: "#6366f1" },
  Completed: { bg: "rgba(16,185,129,0.1)",   color: "#059669", border: "rgba(16,185,129,0.25)", dot: "#10b981" },
  Cancelled: { bg: "rgba(239,68,68,0.1)",    color: "#dc2626", border: "rgba(239,68,68,0.25)",  dot: "#ef4444" },
};

export default function MyAppointments() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("All");

  const fetchData = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;
    fetch(`/api/new-appointments/${user.id}`).then(res => res.json()).then(setData);
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (id, status) => {
    await fetch(`/api/new-appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (status === "Completed") {
      await fetch("/api/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointment_id: id }),
      });
    }
    fetchData();
  };

  const filters = ["All", "Pending", "Completed", "Cancelled"];
  const filteredData = filter === "All" ? data : data.filter(a => a.status === filter);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .ma-root { font-family: 'Plus Jakarta Sans', sans-serif; }
        .ma-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 22px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .ma-title {
          font-size: 24px;
          font-weight: 800;
          color: #1e1b4b;
          letter-spacing: -0.5px;
        }
        .ma-filters {
          display: flex;
          gap: 6px;
          background: white;
          padding: 5px;
          border-radius: 12px;
          border: 1px solid rgba(99,102,241,0.1);
          box-shadow: 0 2px 8px rgba(99,102,241,0.06);
        }
        .ma-filter-btn {
          padding: 7px 16px;
          border-radius: 8px;
          border: none;
          font-size: 13px;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          color: #6b7280;
          background: transparent;
        }
        .ma-filter-btn.active {
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: white;
          box-shadow: 0 3px 10px rgba(99,102,241,0.3);
        }
        .ma-filter-btn:not(.active):hover { background: rgba(99,102,241,0.07); color: #4f46e5; }
        .ma-table-wrap {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(99,102,241,0.1);
          box-shadow: 0 4px 24px rgba(99,102,241,0.06);
        }
        .ma-table { width: 100%; border-collapse: collapse; }
        .ma-table thead { background: linear-gradient(135deg, #f5f3ff, #ede9fe); }
        .ma-table th {
          padding: 14px 18px;
          text-align: left;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #6366f1;
        }
        .ma-table td {
          padding: 14px 18px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          border-top: 1px solid rgba(99,102,241,0.06);
          vertical-align: middle;
        }
        .ma-row:hover td { background: rgba(99,102,241,0.025); }
        .ma-patient { font-weight: 700; color: #1e1b4b; }
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          border-radius: 100px;
          padding: 4px 10px;
          font-size: 11.5px;
          font-weight: 700;
          border: 1px solid;
        }
        .status-dot { width: 6px; height: 6px; border-radius: 50%; }
        .ma-btn {
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
        .ma-btn-accept { background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; box-shadow: 0 3px 8px rgba(99,102,241,0.3); }
        .ma-btn-accept:hover { transform: translateY(-1px); box-shadow: 0 5px 14px rgba(99,102,241,0.4); }
        .ma-btn-reject { background: rgba(239,68,68,0.1); color: #dc2626; border: 1px solid rgba(239,68,68,0.2); }
        .ma-btn-reject:hover { background: rgba(239,68,68,0.18); }
        .ma-btn-complete { background: linear-gradient(135deg, #10b981, #059669); color: white; box-shadow: 0 3px 8px rgba(16,185,129,0.3); }
        .ma-btn-complete:hover { transform: translateY(-1px); }
        .ma-empty { text-align: center; padding: 48px 0; color: #a5b4fc; font-size: 14px; font-weight: 500; }
      `}</style>

      <div className="ma-root">
        <div className="ma-header">
          <h1 className="ma-title">🩺 My Appointments</h1>
          <div className="ma-filters">
            {filters.map(f => (
              <button
                key={f}
                className={`ma-filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >{f}</button>
            ))}
          </div>
        </div>

        <div className="ma-table-wrap">
          <table className="ma-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? filteredData.map(a => {
                const s = statusStyles[a.status] || statusStyles.Pending;
                return (
                  <tr key={a.id} className="ma-row">
                    <td><span className="ma-patient">👤 {a.patient_name}</span></td>
                    <td>{new Date(a.appointment_date).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                    <td>
                      <span className="status-badge" style={{ background: s.bg, color: s.color, borderColor: s.border }}>
                        <span className="status-dot" style={{ background: s.dot }} />{a.status}
                      </span>
                    </td>
                    <td>
                      {a.status === "Pending" && (
                        <>
                          <button className="ma-btn ma-btn-accept" onClick={() => updateStatus(a.id, "Completed")}>✓ Accept</button>
                          <button className="ma-btn ma-btn-reject" onClick={() => updateStatus(a.id, "Cancelled")}>✕ Reject</button>
                        </>
                      )}
                      {a.status === "Approved" && (
                        <button className="ma-btn ma-btn-complete" onClick={() => updateStatus(a.id, "Completed")}>✓ Complete</button>
                      )}
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan={4} className="ma-empty">📋 No appointments found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}