"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";

const BAR_COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "white",
        border: "1px solid rgba(99,102,241,0.15)",
        borderRadius: "12px",
        padding: "10px 14px",
        boxShadow: "0 8px 24px rgba(99,102,241,0.12)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        <p style={{ fontSize: "11px", fontWeight: 700, color: "#6366f1", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.5px" }}>Dr. {label}</p>
        <p style={{ fontSize: "18px", fontWeight: 800, color: "#1e1b4b" }}>{payload[0].value} <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 500 }}>patients</span></p>
      </div>
    );
  }
  return null;
};

export default function DoctorBar({ data }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .bc-card {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: white;
          border-radius: 20px;
          padding: 22px 22px 14px;
          border: 1px solid rgba(99,102,241,0.1);
          box-shadow: 0 4px 24px rgba(99,102,241,0.06);
          position: relative;
          overflow: hidden;
        }
        .bc-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6, #10b981);
        }
        .bc-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 18px;
        }
        .bc-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #10b981);
        }
        .bc-title {
          font-size: 15px;
          font-weight: 700;
          color: #1e1b4b;
        }

@media(max-width:640px){
  .bc-card{padding:16px 12px 10px;border-radius:14px;}
  .bc-title{font-size:13px;}
}
      `}</style>

      <div className="bc-card">
        <div className="bc-header">
          <div className="bc-dot" />
          <span className="bc-title">Doctor Load</span>
        </div>

        <ResponsiveContainer width="100%" height={typeof window !== "undefined" && window.innerWidth < 640 ? 200 : 280}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barSize={28}>
            <CartesianGrid stroke="rgba(99,102,241,0.07)" strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 11, fill: "#9ca3af", fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 11, fill: "#9ca3af", fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.05)", radius: 8 }} />
            <Bar dataKey="total" radius={[8, 8, 0, 0]}>
              {(data || []).map((_, i) => (
                <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}