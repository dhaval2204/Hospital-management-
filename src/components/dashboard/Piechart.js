"use client";

import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#f59e0b", "#10b981", "#6366f1", "#ef4444"];
const LIGHT_COLORS = ["rgba(245,158,11,0.15)", "rgba(16,185,129,0.15)", "rgba(99,102,241,0.15)", "rgba(239,68,68,0.15)"];

const CustomTooltip = ({ active, payload }) => {
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
        <p style={{ fontSize: "11px", fontWeight: 700, color: "#6b7280", marginBottom: 3 }}>{payload[0].name}</p>
        <p style={{ fontSize: "18px", fontWeight: 800, color: "#1e1b4b" }}>{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }) => (
  <div style={{ 
    display: "flex", 
    flexWrap: "wrap", 
    gap: "8px", 
    justifyContent: "center", 
    marginTop: "20px", // Increased margin to prevent overlap
    paddingBottom: "5px" 
  }}>
    {payload.map((entry, i) => (
      <div key={i} style={{
        display: "flex", alignItems: "center", gap: "6px",
        background: LIGHT_COLORS[i % LIGHT_COLORS.length],
        padding: "4px 10px", borderRadius: "100px",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: "11px", fontWeight: 700, color: COLORS[i % COLORS.length],
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: entry.color, display: "inline-block" }} />
        {entry.value}
      </div>
    ))}
  </div>
);

export default function StatusPie({ data = [] }) {
  const formattedData = data.map((item) => ({
    ...item,
    total: Number(item.total),
  }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .pc-card {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: white;
          border-radius: 20px;
          padding: 22px;
          border: 1px solid rgba(99,102,241,0.1);
          box-shadow: 0 4px 24px rgba(99,102,241,0.06);
          position: relative;
          overflow: hidden;
          height: 100%; /* Ensure card takes full height of grid cell */
          display: flex;
          flex-direction: column;
        }
        .pc-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #f59e0b, #10b981, #6366f1, #ef4444);
        }
        .pc-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }
        .pc-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f59e0b, #10b981);
        }
        .pc-title {
          font-size: 15px;
          font-weight: 700;
          color: #1e1b4b;
        }
        .pc-empty {
          text-align: center;
          margin: auto;
          color: #a5b4fc;
          font-size: 14px;
        }

        @media(max-width:640px){
          .pc-card{padding:16px; border-radius:14px;}
          .pc-title{font-size:13px;}
        }
      `}</style>

      <div className="pc-card">
        <div className="pc-header">
          <div className="pc-dot" />
          <span className="pc-title">Status Distribution</span>
        </div>

        {!formattedData.length ? (
          <div className="pc-empty">📊 No data available</div>
        ) : (
          <div style={{ flex: 1, minHeight: "300px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formattedData}
                  dataKey="total"
                  nameKey="status"
                  cx="50%"
                  cy="50%" // Changed from 45% to center it perfectly
                  outerRadius="80%" // Changed to percentage for better responsiveness
                  innerRadius="55%" // Thinner donut looks cleaner
                  paddingAngle={5}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {formattedData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={COLORS[i % COLORS.length]}
                      stroke="#fff"
                      strokeWidth={3}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </>
  );
}