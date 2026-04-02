"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

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
        <p style={{ fontSize: "11px", fontWeight: 700, color: "#6366f1", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</p>
        <p style={{ fontSize: "18px", fontWeight: 800, color: "#1e1b4b" }}>{payload[0].value} <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 500 }}>appts</span></p>
      </div>
    );
  }
  return null;
};

export default function AppointmentsLine({ data }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .lc-card {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: white;
          border-radius: 20px;
          padding: 22px 22px 14px;
          border: 1px solid rgba(99,102,241,0.1);
          box-shadow: 0 4px 24px rgba(99,102,241,0.06);
          position: relative;
          overflow: hidden;
        }
        .lc-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #6366f1, #06b6d4);
        }
        .lc-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 18px;
        }
        .lc-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #06b6d4);
        }
        .lc-title {
          font-size: 15px;
          font-weight: 700;
          color: #1e1b4b;
        }

@media(max-width:640px){
  .lc-card{padding:16px 12px 10px;border-radius:14px;}
  .lc-title{font-size:13px;}
}
      `}</style>

      <div className="lc-card">
        <div className="lc-header">
          <div className="lc-dot" />
          <span className="lc-title">Appointments Per Day</span>
        </div>

        <ResponsiveContainer width="100%" height={typeof window !== "undefined" && window.innerWidth < 640 ? 200 : 280}>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(99,102,241,0.07)" strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 11, fill: "#9ca3af", fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 11, fill: "#9ca3af", fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(99,102,241,0.15)", strokeWidth: 2 }} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#6366f1"
              strokeWidth={3}
              fill="url(#lineGradient)"
              dot={{ fill: "#6366f1", r: 4, strokeWidth: 2, stroke: "white" }}
              activeDot={{ r: 6, fill: "#6366f1", stroke: "white", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}