"use client";
import { useEffect, useState } from "react";
import PatientForm from "@/components/patients/PatientForm";
import PatientTable from "@/components/patients/PatientTable";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ name:"", age:"", disease:"", blood_group:"", phone:"", email:"", address:"", gender:"" });
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchPatients = () => {
    fetch("/api/patients").then(res => res.json()).then(data => setPatients(data));
  };
  useEffect(() => { fetchPatients(); }, []);

  const handleSubmit = async () => {
    const url = editId ? `/api/patients/${editId}` : "/api/patients";
    const method = editId ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ name:"", age:"", disease:"", blood_group:"", phone:"", email:"", address:"", gender:"" });
    setEditId(null); fetchPatients();
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name || "", age: p.age || "", disease: p.disease || "",
      blood_group: p.blood_group || "", phone: p.phone || "",
      email: p.email || "", address: p.address || "", gender: p.gender || ""
    });
    setEditId(p.id);
  };

  const handleDelete = (id) => { setDeleteId(id); setShowModal(true); };
  const confirmDelete = async () => {
    await fetch(`/api/patients/${deleteId}`, { method: "DELETE" });
    setShowModal(false); setDeleteId(null); fetchPatients();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-indigo-950 tracking-tight">🏥 Patients</h1>
          <p className="text-sm text-gray-500 font-medium mt-0.5">
            {patients.length} patient{patients.length !== 1 ? 's' : ''} registered
          </p>
        </div>
      </div>

      <PatientForm form={form} setForm={setForm} onSubmit={handleSubmit} editId={editId} />

      <PatientTable patients={patients} onEdit={handleEdit} onDelete={handleDelete} />

      <ConfirmModal
        isOpen={showModal} onClose={() => setShowModal(false)}
        onConfirm={confirmDelete} message="This will permanently delete the patient."
      />
    </div>
  );
}