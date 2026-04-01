'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DoctorCard from '@/components/doctors/DoctorCard';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name:'', specialization:'', phone:'', email:'', experience:'', fee:'', bio:'', qualification:'' });
  const router = useRouter();

  const load = () => {
    setLoading(true);
    fetch('/api/doctors').then(r => r.json()).then(data => { setDoctors(data); setLoading(false); });
  };
  useEffect(load, []);

  const submit = async () => {
    setSaving(true);
    await fetch('/api/doctors', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
    setShowAdd(false);
    setSaving(false);
    setForm({ name:'',specialization:'',phone:'',email:'',experience:'',fee:'',bio:'',qualification:'' });
    load();
  };

  const filtered = doctors.filter(d =>
    (d.name||'').toLowerCase().includes(search.toLowerCase()) ||
    (d.specialization||'').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .dp-root { font-family: 'Plus Jakarta Sans', sans-serif; }
        .dp-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 14px; }
        .dp-title { font-size: 24px; font-weight: 800; color: #1e1b4b; letter-spacing: -0.5px; }
        .dp-sub { font-size: 13px; color: #6b7280; font-weight: 500; margin-top: 2px; }
        .dp-add-btn { background: linear-gradient(135deg,#6366f1,#4f46e5); color: white; border: none; padding: 11px 22px; border-radius: 12px; font-size: 14px; font-weight: 700; font-family: 'Plus Jakarta Sans',sans-serif; cursor: pointer; box-shadow: 0 4px 14px rgba(99,102,241,0.35); transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        .dp-add-btn:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 8px 20px rgba(99,102,241,0.4); }
        .dp-search-wrap { position: relative; margin-bottom: 22px; max-width: 380px; }
        .dp-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #a5b4fc; font-size: 16px; pointer-events: none; }
        .dp-search { width: 100%; padding: 11px 14px 11px 40px; border: 1.5px solid rgba(99,102,241,0.18); border-radius: 12px; font-size: 14px; font-family: 'Plus Jakarta Sans',sans-serif; font-weight: 500; color: #1e1b4b; background: white; outline: none; transition: all 0.2s; box-sizing: border-box; }
        .dp-search:focus { border-color: #6366f1; box-shadow: 0 0 0 4px rgba(99,102,241,0.1); }
        .dp-search::placeholder { color: #a5b4fc; }
        .dp-form-card { background: white; border-radius: 20px; border: 1px solid rgba(99,102,241,0.15); box-shadow: 0 4px 24px rgba(99,102,241,0.08); padding: 24px; margin-bottom: 24px; position: relative; overflow: hidden; }
        .dp-form-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background: linear-gradient(90deg,#6366f1,#8b5cf6,#06b6d4); }
        .dp-form-title { font-size: 16px; font-weight: 700; color: #1e1b4b; margin-bottom: 18px; display: flex; align-items: center; gap: 8px; }
        .dp-form-dot { width: 8px; height: 8px; border-radius: 50%; background: linear-gradient(135deg,#6366f1,#8b5cf6); }
        .dp-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
        .dp-field label { display: block; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px; color: #6366f1; margin-bottom: 5px; }
        .dp-input { width: 100%; padding: 10px 14px; border: 1.5px solid rgba(99,102,241,0.18); border-radius: 11px; font-size: 14px; font-family: 'Plus Jakarta Sans',sans-serif; font-weight: 500; color: #1e1b4b; background: #fafafe; outline: none; transition: all 0.2s; box-sizing: border-box; }
        .dp-input:focus { border-color: #6366f1; background: white; box-shadow: 0 0 0 4px rgba(99,102,241,0.1); }
        .dp-input::placeholder { color: #a5b4fc; }
        .dp-textarea { resize: vertical; }
        .dp-form-actions { display: flex; gap: 10px; }
        .dp-save-btn { padding: 11px 24px; background: linear-gradient(135deg,#6366f1,#4f46e5); color: white; border: none; border-radius: 12px; font-size: 14px; font-weight: 700; font-family: 'Plus Jakarta Sans',sans-serif; cursor: pointer; box-shadow: 0 4px 14px rgba(99,102,241,0.35); transition: all 0.2s; }
        .dp-save-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .dp-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .dp-cancel-btn { padding: 11px 20px; background: transparent; color: #6b7280; border: 1.5px solid rgba(107,114,128,0.25); border-radius: 12px; font-size: 14px; font-weight: 700; font-family: 'Plus Jakarta Sans',sans-serif; cursor: pointer; transition: all 0.2s; }
        .dp-cancel-btn:hover { background: rgba(107,114,128,0.06); }
        .dp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
        .dp-loading { text-align: center; padding: 60px 20px; }
        .dp-spinner { width: 40px; height: 40px; border: 3px solid rgba(99,102,241,0.15); border-top-color: #6366f1; border-radius: 50%; animation: dp-spin 0.8s linear infinite; margin: 0 auto 12px; }
        @keyframes dp-spin { to { transform: rotate(360deg); } }
        .dp-loading-text { font-size: 14px; color: #6b7280; font-weight: 600; }
        .dp-empty { text-align: center; padding: 60px 20px; }
        .dp-empty-icon { font-size: 40px; margin-bottom: 12px; }
        .dp-empty-text { font-size: 15px; font-weight: 700; color: #a5b4fc; }
      `}</style>

      <div className="dp-root">
        <div className="dp-header">
          <div>
            <div className="dp-title">👨‍⚕️ Doctors</div>
            <div className="dp-sub">{doctors.length} doctor{doctors.length !== 1 ? 's' : ''} registered</div>
          </div>
          <button className="dp-add-btn" onClick={() => setShowAdd(true)}>+ Add Doctor</button>
        </div>

        <div className="dp-search-wrap">
          <span className="dp-search-icon">🔍</span>
          <input
            className="dp-search"
            placeholder="Search by name or specialization..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {showAdd && (
          <div className="dp-form-card">
            <div className="dp-form-title"><div className="dp-form-dot" />Add New Doctor</div>
            <div className="dp-form-grid">
              {[
                ['Full Name','name','text','e.g. Dr. Arjun Mehta'],
                ['Specialization','specialization','text','e.g. Cardiologist'],
                ['Phone','phone','text','e.g. +91 98765 43210'],
                ['Email','email','email','e.g. doctor@hospital.com'],
                ['Experience (years)','experience','number','e.g. 8'],
                ['Consultation Fee (₹)','fee','number','e.g. 500'],
                ['Qualification','qualification','text','e.g. MBBS, MD'],
              ].map(([label,key,type,ph]) => (
                <div key={key} className="dp-field">
                  <label>{label}</label>
                  <input type={type} className="dp-input" placeholder={ph} value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} />
                </div>
              ))}
              <div className="dp-field" style={{ gridColumn:'1/-1' }}>
                <label>Bio / About</label>
                <textarea className="dp-input dp-textarea" rows={3} placeholder="Brief description about the doctor..." value={form.bio} onChange={e=>setForm(f=>({...f,bio:e.target.value}))} />
              </div>
            </div>
            <div className="dp-form-actions">
              <button className="dp-save-btn" onClick={submit} disabled={saving}>{saving?'Adding...':'Add Doctor'}</button>
              <button className="dp-cancel-btn" onClick={()=>setShowAdd(false)}>Cancel</button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="dp-loading">
            <div className="dp-spinner" />
            <div className="dp-loading-text">Loading doctors...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="dp-empty">
            <div className="dp-empty-icon">{search ? '🔍' : '👨‍⚕️'}</div>
            <div className="dp-empty-text">{search ? `No doctors matching "${search}"` : 'No doctors registered yet'}</div>
          </div>
        ) : (
          <div className="dp-grid">
            {filtered.map(doc => (
              <DoctorCard key={doc.id} doctor={doc} onClick={() => router.push(`/doctors/${doc.id}`)} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}