'use client';

import { useEffect, useState } from "react";

export default function DoctorCard({ doctor, onClick }) {
  const initials = (doctor.name || '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const rating = Number(doctor.avg_rating || 0).toFixed(1);
  const stars = Math.round(Number(doctor.avg_rating || 0));

  // ✅ FIX: use whichever patient count field the API actually returns
   const [patientCount, setPatientCount] = useState(
    doctor.active_patient_count ??
    doctor.patient_count ??
    doctor.assigned_patients ??
    0
  );

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const res = await fetch(`/api/doctors/${doctor.id}/patients`);
        const data = await res.json();

        if (Array.isArray(data)) {
          const activeCount = data.filter(p => p.status === 'Active').length;
          setPatientCount(activeCount);
        }
      } catch (err) {
        console.error('Failed to load patient count:', err);
      }
    };

    loadPatients();
  }, [doctor.id]);

  const specColors = [
    { bg: 'rgba(99,102,241,0.1)', color: '#4f46e5' },
    { bg: 'rgba(16,185,129,0.1)', color: '#059669' },
    { bg: 'rgba(245,158,11,0.1)', color: '#d97706' },
    { bg: 'rgba(6,182,212,0.1)', color: '#0891b2' },
    { bg: 'rgba(239,68,68,0.1)', color: '#dc2626' },
    { bg: 'rgba(139,92,246,0.1)', color: '#7c3aed' },
  ];
  const sc = specColors[((doctor.name || ' ').charCodeAt(0)) % specColors.length];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .dc-card {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: white; border-radius: 20px;
          border: 1px solid rgba(99,102,241,0.1);
          box-shadow: 0 4px 20px rgba(99,102,241,0.06);
          padding: 22px; cursor: pointer;
          transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
          position: relative; overflow: hidden;
        }
        .dc-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4);
          opacity: 0; transition: opacity 0.2s;
        }
        .dc-card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(99,102,241,0.14); border-color: rgba(99,102,241,0.2); }
        .dc-card:hover::before { opacity: 1; }
        .dc-top { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
        .dc-avatar {
          width: 50px; height: 50px; border-radius: 14px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white; font-size: 17px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 12px rgba(99,102,241,0.3); flex-shrink: 0;
        }
        .dc-name { font-size: 15px; font-weight: 800; color: #1e1b4b; margin-bottom: 3px; }
        .dc-spec { display: inline-flex; align-items: center; gap: 4px; border-radius: 100px; padding: 2px 9px; font-size: 11px; font-weight: 700; }
        .dc-qual { font-size: 11.5px; color: #9ca3af; font-weight: 500; margin-top: 2px; }
        .dc-bio { font-size: 12.5px; color: #6b7280; line-height: 1.5; margin-bottom: 14px;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .dc-stars { display: flex; gap: 1px; align-items: center; margin-bottom: 12px; }
        .dc-stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 14px; }
        .dc-stat { background: #fafafe; border: 1px solid rgba(99,102,241,0.08); border-radius: 10px; padding: 9px 8px; text-align: center; }
        .dc-stat-val { font-size: 15px; font-weight: 800; color: #1e1b4b; line-height: 1; margin-bottom: 3px; }
        .dc-stat-label { font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #9ca3af; }
        .dc-bottom { display: flex; align-items: center; justify-content: space-between; }
        .dc-status { display: inline-flex; align-items: center; gap: 5px; border-radius: 100px; padding: 3px 10px; font-size: 11px; font-weight: 700; }
        .dc-status-dot { width: 6px; height: 6px; border-radius: 50%; }
        .dc-view-btn { display: inline-flex; align-items: center; gap: 5px; background: rgba(99,102,241,0.08); color: #4f46e5; border-radius: 100px; padding: 5px 12px; font-size: 12px; font-weight: 700; border: 1px solid rgba(99,102,241,0.18); transition: all 0.2s; }

@media (max-width: 480px) {
  .dc-card { padding: 16px; }
  .dc-stats { grid-template-columns: 1fr 1fr 1fr; gap: 6px; }
  .dc-stat-val { font-size: 13px; }
  .dc-name { font-size: 14px; }
}
        .dc-card:hover .dc-view-btn { background: linear-gradient(135deg,#6366f1,#4f46e5); color: white; border-color: transparent; }
      `}</style>
      <div className="dc-card" onClick={onClick}>
        <div className="dc-top">
          <div className="dc-avatar">{initials}</div>
          <div style={{ flex: 1 }}>
            <div className="dc-name">{doctor.name}</div>
            <span className="dc-spec" style={{ background: sc.bg, color: sc.color }}>🩺 {doctor.specialization}</span>
            {doctor.qualification && <div className="dc-qual">{doctor.qualification}</div>}
          </div>
        </div>
        {doctor.bio && <div className="dc-bio">{doctor.bio}</div>}
        <div className="dc-stars">
          {[1,2,3,4,5].map(i => <span key={i} style={{ fontSize: 12 }}>{i <= stars ? '⭐' : '☆'}</span>)}
          <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, marginLeft: 5 }}>{rating} ({doctor.rating_count || 0})</span>
        </div>
        <div className="dc-stats">
          <div className="dc-stat">
            <div className="dc-stat-val">{doctor.experience || 0}</div>
            <div className="dc-stat-label">Yrs Exp</div>
          </div>
          <div className="dc-stat">
            <div className="dc-stat-val">₹{doctor.fee || 0}</div>
            <div className="dc-stat-label">Fee</div>
          </div>
          {/* ✅ FIXED: patientCount uses the correct fallback chain */}
          <div className="dc-stat">
            <div className="dc-stat-val">{patientCount}</div>
            <div className="dc-stat-label">Patients</div>
          </div>
        </div>
        <div className="dc-bottom">
          <span className="dc-status" style={{
            background: (doctor.status||'Active')==='Active' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            color: (doctor.status||'Active')==='Active' ? '#059669' : '#dc2626'
          }}>
            <span className="dc-status-dot" style={{ background: (doctor.status||'Active')==='Active' ? '#10b981' : '#ef4444' }} />
            {doctor.status || 'Active'}
          </span>
          <span className="dc-view-btn">View Profile →</span>
        </div>
      </div>
    </>
  );
}