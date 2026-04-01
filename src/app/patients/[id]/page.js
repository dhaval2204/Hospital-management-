'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PatientDetailView from '@/components/patients/PatientDetailView';

export default function PatientDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPatient = async () => {
    try {
      setLoading(true);
      // Fetch base patient
      const res = await fetch(`/api/patients/${id}`);
      if (!res.ok) throw new Error('Patient not found');
      const data = await res.json();

      // Fetch history, insurance, appointments in parallel
      const [historyRes, insuranceRes, appointmentsRes] = await Promise.all([
        fetch(`/api/patients/${id}/history`).then(r => r.ok ? r.json() : []),
        fetch(`/api/patients/${id}/insurance`).then(r => r.ok ? r.json() : []),
        fetch(`/api/appointments?patient_id=${id}`).then(r => r.ok ? r.json() : []),
      ]);

      setPatient({
        ...data,
        history: Array.isArray(historyRes) ? historyRes : [],
        insurance: Array.isArray(insuranceRes) ? insuranceRes : [],
        appointments: Array.isArray(appointmentsRes) ? appointmentsRes : [],
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchPatient();
  }, [id]);

  if (loading) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .pdp-loading {
          font-family: 'Plus Jakarta Sans', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          gap: 16px;
        }
        .pdp-spinner {
          width: 44px; height: 44px;
          border: 3px solid rgba(99,102,241,0.15);
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: pdp-spin 0.8s linear infinite;
        }
        @keyframes pdp-spin { to { transform: rotate(360deg); } }
        .pdp-loading-text {
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
        }
        .pdp-loading-sub {
          font-size: 12px;
          color: #a5b4fc;
          font-weight: 500;
        }
      `}</style>
      <div className="pdp-loading">
        <div className="pdp-spinner" />
        <div className="pdp-loading-text">Loading patient profile...</div>
        <div className="pdp-loading-sub">Fetching records & history</div>
      </div>
    </>
  );

  if (error) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .pdp-error {
          font-family: 'Plus Jakarta Sans', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          gap: 12px;
        }
        .pdp-error-icon { font-size: 40px; }
        .pdp-error-title { font-size: 18px; font-weight: 700; color: #1e1b4b; }
        .pdp-error-msg { font-size: 13px; color: #6b7280; }
        .pdp-back-btn {
          margin-top: 8px;
          padding: 10px 22px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(99,102,241,0.3);
          transition: all 0.2s;
        }
        .pdp-back-btn:hover { transform: translateY(-2px); }
      `}</style>
      <div className="pdp-error">
        <div className="pdp-error-icon">⚠️</div>
        <div className="pdp-error-title">Patient not found</div>
        <div className="pdp-error-msg">{error}</div>
        <button className="pdp-back-btn" onClick={() => router.push('/patients')}>← Back to Patients</button>
      </div>
    </>
  );

  return <PatientDetailView patient={patient} onUpdate={fetchPatient} />;
}