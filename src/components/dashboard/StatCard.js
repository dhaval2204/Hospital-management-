// components/dashboard/StatCard.js
"use client";
import { useEffect, useRef } from "react";

const gradients = {
  blue:    "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
  green:   "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  purple:  "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
  orange:  "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
  red:     "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
  cyan:    "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
};

const shadows = {
  blue:   "0 8px 25px rgba(99,102,241,0.35)",
  green:  "0 8px 25px rgba(16,185,129,0.35)",
  purple: "0 8px 25px rgba(139,92,246,0.35)",
  orange: "0 8px 25px rgba(245,158,11,0.35)",
  red:    "0 8px 25px rgba(239,68,68,0.35)",
  cyan:   "0 8px 25px rgba(6,182,212,0.35)",
};

export default function StatCard({ title, value, color = "blue", icon, trend }) {
  const colorKey = color.includes("bg-blue") ? "blue"
    : color.includes("bg-green") ? "green"
    : color.includes("bg-purple") ? "purple"
    : color.includes("bg-orange") ? "orange"
    : color.includes("bg-red") ? "red"
    : "cyan";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .stat-card {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: ${gradients[colorKey] || gradients.blue};
          border-radius: 18px;
          padding: 22px 24px;
          color: white;
          position: relative;
          overflow: hidden;
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease;
          box-shadow: ${shadows[colorKey] || shadows.blue};
          cursor: default;
        }
        .stat-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        .stat-card-blob {
          position: absolute;
          top: -30px; right: -30px;
          width: 120px; height: 120px;
          background: rgba(255,255,255,0.12);
          border-radius: 50%;
          pointer-events: none;
        }
        .stat-card-blob2 {
          position: absolute;
          bottom: -50px; left: -20px;
          width: 140px; height: 140px;
          background: rgba(255,255,255,0.06);
          border-radius: 50%;
          pointer-events: none;
        }
        .stat-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          opacity: 0.78;
          margin-bottom: 10px;
        }
        .stat-value {
          font-size: 36px;
          font-weight: 800;
          line-height: 1;
          letter-spacing: -1px;
        }
        .stat-trend {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 600;
          background: rgba(255,255,255,0.2);
          border-radius: 100px;
          padding: 3px 8px;
          margin-top: 10px;
        }
        .stat-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%);
          animation: shimmer 3s infinite;
        }

@media (max-width: 640px) {
  .stat-card { padding: 18px 18px; border-radius: 14px; }
  .stat-value { font-size: 28px; }
  .stat-label { font-size: 10px; }
}
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
      <div className="stat-card">
        <div className="stat-card-blob" />
        <div className="stat-card-blob2" />
        <div className="stat-shimmer" />
        <div className="stat-label">{title}</div>
        <div className="stat-value">{value}</div>
        {trend && <div className="stat-trend">↑ {trend}</div>}
      </div>
    </>
  );
}