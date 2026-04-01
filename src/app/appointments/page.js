'use client';
import { useEffect, useState } from 'react';
import AppointmentForm from '@/components/appointments/AppointmentForm';
import AppointmentTable from '@/components/appointments/AppointmentTable';
import AppointmentDrawer from '@/components/appointments/AppointmentDrawer'; // ← ADD
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function Appointments() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    patient_id:'', doctor_id:'', appointment_date:'',
    appointment_time:'', status:'Pending', notes:'',
  });
  const [editId, setEditId]       = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId]   = useState(null);
  const [drawerId, setDrawerId]   = useState(null); // ← ADD

  const fetchData = () => {
    fetch('/api/appointments')
      .then(r => r.json())
      .then(d => setData(Array.isArray(d) ? d : []));
  };
  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async () => {
    const url    = editId ? `/api/appointments/${editId}` : '/api/appointments';
    const method = editId ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.status === 409) {
      alert('⚠️ This time slot is already booked!');
      return;
    }
    setForm({ patient_id:'', doctor_id:'', appointment_date:'', appointment_time:'', status:'Pending', notes:'' });
    setEditId(null);
    fetchData();
  };

  const handleEdit = (a) => {
    setForm({
      patient_id:       a.patient_id,
      doctor_id:        a.doctor_id,
      appointment_date: a.appointment_date?.split('T')[0] || a.appointment_date,
      appointment_time: a.appointment_time?.slice(0,5) || '',
      status:           a.status,
      notes:            a.notes || '',
    });
    setEditId(a.id);
    window.scrollTo({ top:0, behavior:'smooth' });
  };

  const handleDelete  = (id) => { setDeleteId(id); setShowModal(true); };
  const confirmDelete = async () => {
    await fetch(`/api/appointments/${deleteId}`, { method:'DELETE' });
    setShowModal(false); setDeleteId(null); fetchData();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .ap-root { font-family:'Plus Jakarta Sans',sans-serif; }
        .ap-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px; }
        .ap-title { font-size:24px; font-weight:800; color:#1e1b4b; letter-spacing:-0.5px; }
        .ap-sub { font-size:13px; color:#6b7280; font-weight:500; margin-top:2px; }
        .ap-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:24px; }
        .ap-stat { background:white; border-radius:14px; padding:16px 18px; border:1px solid rgba(99,102,241,0.1); box-shadow:0 2px 12px rgba(99,102,241,0.05); position:relative; overflow:hidden; }
        .ap-stat::after { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:var(--ap-color); }
        .ap-stat-val { font-size:22px; font-weight:800; color:#1e1b4b; letter-spacing:-0.5px; }
        .ap-stat-lbl { font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.7px; color:#9ca3af; margin-top:3px; }
      `}</style>

      <div className="ap-root">
        <div className="ap-header">
          <div>
            <div className="ap-title">📅 Appointments</div>
            <div className="ap-sub">{data.length} total appointment{data.length !== 1 ? 's' : ''}</div>
          </div>
        </div>

        <div className="ap-stats">
          {[
            { label:'Total',     val:data.length,                                    color:'#6366f1' },
            { label:'Pending',   val:data.filter(a=>a.status==='Pending').length,    color:'#f59e0b' },
            { label:'Completed', val:data.filter(a=>a.status==='Completed').length,  color:'#10b981' },
            { label:'Cancelled', val:data.filter(a=>a.status==='Cancelled').length,  color:'#ef4444' },
          ].map(({ label, val, color }) => (
            <div key={label} className="ap-stat" style={{ '--ap-color':color }}>
              <div className="ap-stat-val">{val}</div>
              <div className="ap-stat-lbl">{label}</div>
            </div>
          ))}
        </div>

        <AppointmentForm
          form={form} setForm={setForm}
          onSubmit={handleSubmit} editId={editId}
        />

        {/* ← Pass onRowClick to open drawer */}
        <AppointmentTable
          data={data}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRowClick={(id) => setDrawerId(id)}
        />

        <ConfirmModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={confirmDelete}
          message="This will permanently delete the appointment."
        />

        {/* ← Drawer */}
        {drawerId && (
          <AppointmentDrawer
            appointmentId={drawerId}
            onClose={() => setDrawerId(null)}
            onEdit={(a) => { setDrawerId(null); handleEdit(a); }}
            onDelete={(id) => { setDrawerId(null); handleDelete(id); }}
          />
        )}
      </div>
    </>
  );
}