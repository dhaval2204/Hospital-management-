'use client';
import { useEffect, useState } from 'react';
import AppointmentForm from '@/components/appointments/AppointmentForm';
import AppointmentTable from '@/components/appointments/AppointmentTable';
import AppointmentDrawer from '@/components/appointments/AppointmentDrawer';
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
  const [drawerId, setDrawerId]   = useState(null);

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
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.status === 409) { alert('⚠️ This time slot is already booked!'); return; }
    setForm({ patient_id:'', doctor_id:'', appointment_date:'', appointment_time:'', status:'Pending', notes:'' });
    setEditId(null); fetchData();
  };

  const handleEdit = (a) => {
    setForm({
      patient_id: a.patient_id, doctor_id: a.doctor_id,
      appointment_date: a.appointment_date?.split('T')[0] || a.appointment_date,
      appointment_time: a.appointment_time?.slice(0,5) || '',
      status: a.status, notes: a.notes || '',
    });
    setEditId(a.id);
    window.scrollTo({ top:0, behavior:'smooth' });
  };

  const handleDelete  = (id) => { setDeleteId(id); setShowModal(true); };
  const confirmDelete = async () => {
    await fetch(`/api/appointments/${deleteId}`, { method:'DELETE' });
    setShowModal(false); setDeleteId(null); fetchData();
  };

  const stats = [
    { label:'Total',     val:data.length,                                   bar:'bg-indigo-500' },
    { label:'Pending',   val:data.filter(a=>a.status==='Pending').length,   bar:'bg-amber-400' },
    { label:'Completed', val:data.filter(a=>a.status==='Completed').length, bar:'bg-emerald-500' },
    { label:'Cancelled', val:data.filter(a=>a.status==='Cancelled').length, bar:'bg-red-400' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-indigo-950 tracking-tight">📅 Appointments</h1>
          <p className="text-sm text-gray-500 font-medium mt-0.5">
            {data.length} total appointment{data.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {stats.map(({ label, val, bar }) => (
          <div key={label} className="bg-white rounded-2xl p-4 border border-indigo-50 shadow-sm relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-1 ${bar} rounded-t-2xl`} />
            <div className="text-2xl font-extrabold text-indigo-950 tracking-tight">{val}</div>
            <div className="text-[10.5px] font-bold uppercase tracking-widest text-gray-400 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <AppointmentForm form={form} setForm={setForm} onSubmit={handleSubmit} editId={editId} />

      <AppointmentTable
        data={data} onEdit={handleEdit}
        onDelete={handleDelete} onRowClick={(id) => setDrawerId(id)}
      />

      <ConfirmModal
        isOpen={showModal} onClose={() => setShowModal(false)}
        onConfirm={confirmDelete} message="This will permanently delete the appointment."
      />

      {drawerId && (
        <AppointmentDrawer
          appointmentId={drawerId} onClose={() => setDrawerId(null)}
          onEdit={(a) => { setDrawerId(null); handleEdit(a); }}
          onDelete={(id) => { setDrawerId(null); handleDelete(id); }}
        />
      )}
    </div>
  );
}