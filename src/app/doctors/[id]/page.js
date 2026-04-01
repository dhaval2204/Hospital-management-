'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DoctorDetailView from '@/components/doctors/DoctorDetailView';

export default function DoctorDetailPage() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const res  = await fetch(`/api/doctors/${id}`);
      const data = await res.json();
      if (data.error) { setError(data.error); }
      else { setDoctor(data); }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', flexDirection: 'column', gap: '12px',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '50%',
        border: '3px solid rgba(99,102,241,0.2)',
        borderTop: '3px solid #6366f1',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: 600 }}>
        Loading doctor profile...
      </span>
    </div>
  );

  if (error || !doctor) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', flexDirection: 'column', gap: '8px',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <div style={{ fontSize: '40px' }}>⚠️</div>
      <div style={{ fontSize: '16px', fontWeight: 700, color: '#1e1b4b' }}>
        {error || 'Doctor not found'}
      </div>
      <button
        onClick={() => window.history.back()}
        style={{
          marginTop: '8px', padding: '8px 20px', borderRadius: '100px',
          border: '1.5px solid rgba(99,102,241,0.3)',
          background: 'rgba(99,102,241,0.07)', color: '#4f46e5',
          fontSize: '13px', fontWeight: 700, cursor: 'pointer',
        }}
      >← Go back</button>
    </div>
  );

  return <DoctorDetailView doctor={doctor} onUpdate={load} />;
}