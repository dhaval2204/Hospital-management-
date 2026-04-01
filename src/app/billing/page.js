"use client";

import { useEffect, useState } from "react";

export default function Billing() {
  const [data, setData] = useState([]);

  const fetchData = () => {
    fetch("/api/billing").then(res => res.json()).then(setData);
  };

  useEffect(() => { fetchData(); }, []);

  const markPaid = async (id) => {
    await fetch(`/api/billing/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Paid" }),
    });
    fetchData();
  };

  const total = data.reduce((s, b) => s + Number(b.amount || 0), 0);
  const paid = data.filter(b => b.status === "Paid").reduce((s, b) => s + Number(b.amount || 0), 0);
  const pending = total - paid;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .billing-root { font-family: 'Plus Jakarta Sans', sans-serif; }
        .billing-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .billing-title {
          font-size: 24px;
          font-weight: 800;
          color: #1e1b4b;
          letter-spacing: -0.5px;
        }
        .billing-title span { color: #6366f1; }
        .billing-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        .bstat {
          background: white;
          border-radius: 16px;
          padding: 20px 22px;
          border: 1px solid rgba(99,102,241,0.1);
          box-shadow: 0 4px 16px rgba(99,102,241,0.05);
          position: relative;
          overflow: hidden;
        }
        .bstat::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--bstat-color);
        }
        .bstat-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #6b7280;
          margin-bottom: 8px;
        }
        .bstat-value {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.5px;
          color: var(--bstat-color);
        }
        .billing-table-wrap {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(99,102,241,0.1);
          box-shadow: 0 4px 24px rgba(99,102,241,0.06);
        }
        .billing-table { width: 100%; border-collapse: collapse; }
        .billing-table thead { background: linear-gradient(135deg, #f5f3ff, #ede9fe); }
        .billing-table th {
          padding: 14px 18px;
          text-align: left;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #6366f1;
        }
        .billing-table td {
          padding: 14px 18px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          border-top: 1px solid rgba(99,102,241,0.06);
          vertical-align: middle;
        }
        .billing-row:hover td { background: rgba(99,102,241,0.025); }
        .billing-amount {
          font-weight: 800;
          font-size: 15px;
          color: #1e1b4b;
        }
        .billing-status {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          border-radius: 100px;
          padding: 4px 11px;
          font-size: 11.5px;
          font-weight: 700;
          border: 1px solid;
        }
        .status-dot { width: 6px; height: 6px; border-radius: 50%; }
        .paid-badge { background: rgba(16,185,129,0.1); color: #059669; border-color: rgba(16,185,129,0.25); }
        .pending-badge { background: rgba(245,158,11,0.1); color: #d97706; border-color: rgba(245,158,11,0.25); }
        .mark-paid-btn {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 9px;
          font-size: 12px;
          font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 3px 8px rgba(16,185,129,0.3);
        }
        .mark-paid-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 14px rgba(16,185,129,0.4); }
      `}</style>

      <div className="billing-root">
        <div className="billing-header">
          <h1 className="billing-title">💳 Billing <span>& Payments</span></h1>
        </div>

        <div className="billing-stats">
          <div className="bstat" style={{ "--bstat-color": "#6366f1" }}>
            <div className="bstat-label">Total Billed</div>
            <div className="bstat-value">₹{total.toLocaleString("en-IN")}</div>
          </div>
          <div className="bstat" style={{ "--bstat-color": "#10b981" }}>
            <div className="bstat-label">Collected</div>
            <div className="bstat-value">₹{paid.toLocaleString("en-IN")}</div>
          </div>
          <div className="bstat" style={{ "--bstat-color": "#f59e0b" }}>
            <div className="bstat-label">Pending</div>
            <div className="bstat-value">₹{pending.toLocaleString("en-IN")}</div>
          </div>
        </div>

        <div className="billing-table-wrap">
          <table className="billing-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((b) => (
                <tr key={b.id} className="billing-row">
                  <td>👤 {b.patient_name}</td>
                  <td>🩺 {b.doctor_name}</td>
                  <td><span className="billing-amount">₹{Number(b.amount).toLocaleString("en-IN")}</span></td>
                  <td>
                    {b.status === "Paid" ? (
                      <span className="billing-status paid-badge">
                        <span className="status-dot" style={{ background: "#10b981" }} /> Paid
                      </span>
                    ) : (
                      <span className="billing-status pending-badge">
                        <span className="status-dot" style={{ background: "#f59e0b" }} /> Pending
                      </span>
                    )}
                  </td>
                  <td>
                    {b.status === "Pending" && (
                      <button className="mark-paid-btn" onClick={() => markPaid(b.id)}>✓ Mark Paid</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}