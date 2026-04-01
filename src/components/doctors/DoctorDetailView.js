'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RatingsPanel from '@/components/doctors/RatingsPanel';
import ScheduleManager from '@/components/doctors/ScheduleManager';
import PatientAssignments from '@/components/doctors/PatientAssignments';
import LeaveManager from '@/components/doctors/LeaveManager';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
.ddv * { box-sizing: border-box; }
.ddv { font-family: 'Plus Jakarta Sans', sans-serif; max-width: 960px; margin: 0 auto; padding: 24px; }
.ddv-back { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #6366f1; background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.2); border-radius: 100px; padding: 6px 14px; cursor: pointer; margin-bottom: 20px; transition: all 0.2s; }
.ddv-back:hover { background: rgba(99,102,241,0.14); transform: translateX(-2px); }
.ddv-hero { background: white; border-radius: 20px; border: 1px solid rgba(99,102,241,0.1); box-shadow: 0 4px 24px rgba(99,102,241,0.07); margin-bottom: 20px; overflow: hidden; }
.ddv-hero-banner { height: 80px; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #0891b2 100%); position: relative; }
.ddv-hero-banner::after { content: '🏥'; position: absolute; right: 24px; top: 10px; font-size: 50px; opacity: 0.12; }
.ddv-hero-body { padding: 0 24px 22px; display: flex; align-items: flex-end; gap: 18px; flex-wrap: wrap; }
.ddv-avatar { width: 70px; height: 70px; border-radius: 18px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; font-size: 24px; font-weight: 800; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 16px rgba(99,102,241,0.35); margin-top: -35px; flex-shrink: 0; }
.ddv-hero-info { flex: 1; padding-top: 12px; min-width: 200px; }
.ddv-doc-name { font-size: 22px; font-weight: 800; color: #1e1b4b; letter-spacing: -0.4px; margin-bottom: 4px; }
.ddv-doc-meta { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.ddv-qual-badge { background: rgba(99,102,241,0.1); color: #4f46e5; border-radius: 100px; padding: 3px 10px; font-size: 12px; font-weight: 700; }
.ddv-spec-badge { border-radius: 100px; padding: 3px 10px; font-size: 12px; font-weight: 700; background: rgba(6,182,212,0.1); color: #0891b2; }
.ddv-stars-row { display: flex; align-items: center; gap: 4px; font-size: 12px; }
.ddv-hero-actions { margin-left: auto; padding-top: 12px; }
.ddv-stat-bar { display: grid; grid-template-columns: repeat(4,1fr); background: #fafafe; border-top: 1px solid rgba(99,102,241,0.08); }
.ddv-stat-cell { padding: 14px 20px; text-align: center; border-right: 1px solid rgba(99,102,241,0.07); }
.ddv-stat-cell:last-child { border-right: none; }
.ddv-stat-val { font-size: 20px; font-weight: 800; color: #1e1b4b; letter-spacing: -0.5px; }
.ddv-stat-lbl { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px; color: #9ca3af; margin-top: 2px; }
.ddv-tabs { display: flex; gap: 4px; background: white; border-radius: 20px; border: 1px solid rgba(99,102,241,0.1); box-shadow: 0 4px 20px rgba(99,102,241,0.06); padding: 6px; margin-bottom: 20px; overflow-x: auto; }
.ddv-tab { flex: 1; padding: 9px 12px; border: none; border-radius: 13px; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 600; color: #6b7280; background: transparent; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px; white-space: nowrap; }
.ddv-tab:hover:not(.active) { background: rgba(99,102,241,0.06); color: #4f46e5; }
.ddv-tab.active { background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; box-shadow: 0 3px 10px rgba(99,102,241,0.3); }
.ddv-panel { background: white; border-radius: 20px; border: 1px solid rgba(99,102,241,0.1); box-shadow: 0 4px 24px rgba(99,102,241,0.06); padding: 24px; animation: ddv-in 0.25s ease; }
@keyframes ddv-in { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
.ddv-sec-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.ddv-sec-title { font-size: 15px; font-weight: 700; color: #1e1b4b; display: flex; align-items: center; gap: 8px; }
.ddv-sec-dot { width: 7px; height: 7px; border-radius: 50%; background: linear-gradient(135deg,#6366f1,#8b5cf6); flex-shrink: 0; }
.ddv-add-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 10px; border: 1.5px solid rgba(99,102,241,0.25); background: rgba(99,102,241,0.06); color: #4f46e5; font-size: 13px; font-weight: 700; font-family: 'Plus Jakarta Sans',sans-serif; cursor: pointer; transition: all 0.2s; }
.ddv-add-btn:hover { background: rgba(99,102,241,0.12); transform: translateY(-1px); }
.ddv-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
.ddv-field label { display: block; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px; color: #6366f1; margin-bottom: 5px; }
.ddv-input,.ddv-select,.ddv-textarea { width: 100%; padding: 9px 13px; border: 1.5px solid rgba(99,102,241,0.18); border-radius: 10px; font-size: 13.5px; font-family: 'Plus Jakarta Sans',sans-serif; font-weight: 500; color: #1e1b4b; background: white; outline: none; transition: all 0.2s; }
.ddv-input:focus,.ddv-select:focus,.ddv-textarea:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
.ddv-textarea { resize: vertical; }
.ddv-form-actions { display: flex; gap: 8px; }
.ddv-save-btn { padding: 9px 20px; background: linear-gradient(135deg,#6366f1,#4f46e5); color: white; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; font-family: 'Plus Jakarta Sans',sans-serif; cursor: pointer; box-shadow: 0 3px 10px rgba(99,102,241,0.3); transition: all 0.2s; }
.ddv-save-btn:hover { transform: translateY(-1px); }
.ddv-save-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
.ddv-cancel-btn { padding: 9px 20px; background: transparent; color: #6b7280; border: 1.5px solid rgba(107,114,128,0.25); border-radius: 10px; font-size: 13px; font-weight: 700; font-family: 'Plus Jakarta Sans',sans-serif; cursor: pointer; }
.ddv-cancel-btn:hover { background: rgba(107,114,128,0.06); }
.ddv-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.ddv-info-cell { background: #fafafe; border: 1px solid rgba(99,102,241,0.08); border-radius: 12px; padding: 14px 16px; transition: border-color 0.2s; }
.ddv-info-cell:hover { border-color: rgba(99,102,241,0.2); }
.ddv-info-label { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px; color: #9ca3af; margin-bottom: 5px; }
.ddv-info-value { font-size: 14px; font-weight: 600; color: #1e1b4b; }
.ddv-edit-form { background: #fafafe; border: 1.5px solid rgba(99,102,241,0.15); border-radius: 16px; padding: 20px; margin-bottom: 20px; }
`;

export default function DoctorDetailView({ doctor: propDoctor, onUpdate }) {
  const router = useRouter();
  const [doctor, setDoctor] = useState(propDoctor || {});
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    if (propDoctor?.id) setDoctor(propDoctor);
  }, [propDoctor]);

  const docId = doctor?.id;
  const initials = (doctor?.name || 'DR')
    .replace(/Dr\.?\s*/i, '').trim()
    .split(' ').filter(Boolean)
    .map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'DR';
  const avgRating = Number(doctor?.avg_rating || 0).toFixed(1);
  const stars = Math.round(Number(doctor?.avg_rating || 0));

  const reload = async () => {
    if (!docId) return;
    const res = await fetch(`/api/doctors/${docId}`);
    const data = await res.json();
    setDoctor(data);
    if (onUpdate) onUpdate();
  };

  const openEdit = () => {
    setEditForm({
      name: doctor?.name || '', specialization: doctor?.specialization || '',
      phone: doctor?.phone || '', email: doctor?.email || '',
      experience: doctor?.experience || '', fee: doctor?.fee || '',
      bio: doctor?.bio || '', qualification: doctor?.qualification || '',
      status: doctor?.status || 'Active',
    });
    setEditMode(true);
  };

  const saveProfile = async () => {
    setSaving(true);
    await fetch(`/api/doctors/${docId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    setEditMode(false); setSaving(false); reload();
  };

  const handleRatingsUpdate = (data) => {
    if (data?.ratings) {
      setDoctor(prev => ({ ...prev, ratings: data.ratings, avg_rating: data.avgRating, rating_count: data.ratingCount }));
    } else { reload(); }
  };

  const tabs = [
    { key: 'profile',  label: 'Profile',  icon: '👤' },
    { key: 'schedule', label: 'Schedule', icon: '🗓️' },
    { key: 'patients', label: 'Patients', icon: '🧑‍⚕️' },
    { key: 'leaves',   label: 'Leaves',   icon: '🏖️' },
    { key: 'ratings',  label: 'Ratings',  icon: '⭐' },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="ddv">
        <button className="ddv-back" onClick={() => router.push('/doctors')}>← Back to Doctors</button>

        {/* Hero */}
        <div className="ddv-hero">
          <div className="ddv-hero-banner" />
          <div className="ddv-hero-body">
            <div className="ddv-avatar">{initials}</div>
            <div className="ddv-hero-info">
              <div className="ddv-doc-name">{doctor?.name || '—'}</div>
              <div className="ddv-doc-meta">
                {doctor?.qualification && <span className="ddv-qual-badge">{doctor.qualification}</span>}
                {doctor?.specialization && <span className="ddv-spec-badge">🩺 {doctor.specialization}</span>}
                <span className="ddv-stars-row">
                  {[1,2,3,4,5].map(i => <span key={i}>{i <= stars ? '⭐' : '☆'}</span>)}
                  <span style={{ color: '#9ca3af', fontWeight: 600 }}>
                    {avgRating} · {doctor?.rating_count || 0} reviews
                  </span>
                </span>
              </div>
            </div>
            <div className="ddv-hero-actions">
              <button className="ddv-add-btn" onClick={openEdit}>✏️ Edit profile</button>
            </div>
          </div>
          <div className="ddv-stat-bar">
            <div className="ddv-stat-cell"><div className="ddv-stat-val">{doctor?.experience || 0} yrs</div><div className="ddv-stat-lbl">Experience</div></div>
            <div className="ddv-stat-cell"><div className="ddv-stat-val">₹{Number(doctor?.fee || 0).toLocaleString('en-IN')}</div><div className="ddv-stat-lbl">Fee</div></div>
            <div className="ddv-stat-cell"><div className="ddv-stat-val">{(doctor?.patients || []).filter(p => p.status === 'Active').length}</div><div className="ddv-stat-lbl">Patients</div></div>
            <div className="ddv-stat-cell"><div className="ddv-stat-val">{avgRating}/5</div><div className="ddv-stat-lbl">Rating</div></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="ddv-tabs">
          {tabs.map(t => (
            <button key={t.key} className={`ddv-tab${activeTab === t.key ? ' active' : ''}`} onClick={() => setActiveTab(t.key)}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* Profile */}
        {activeTab === 'profile' && (
          <div className="ddv-panel">
            {editMode ? (
              <div className="ddv-edit-form">
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1e1b4b', marginBottom: 16 }}>✏️ Edit Doctor Profile</div>
                <div className="ddv-form-grid">
                  {[['Full Name','name','text'],['Specialization','specialization','text'],['Phone','phone','text'],['Email','email','email'],['Experience (yrs)','experience','number'],['Fee (₹)','fee','number'],['Qualification','qualification','text']].map(([label, key, type]) => (
                    <div key={key} className="ddv-field">
                      <label>{label}</label>
                      <input type={type} className="ddv-input" value={editForm[key] || ''} onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))} />
                    </div>
                  ))}
                  <div className="ddv-field">
                    <label>Status</label>
                    <select className="ddv-select" value={editForm.status || 'Active'} onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}>
                      <option>Active</option><option>On Leave</option><option>Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="ddv-field" style={{ marginBottom: 14 }}>
                  <label>Bio</label>
                  <textarea className="ddv-textarea" rows={3} value={editForm.bio || ''} onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))} />
                </div>
                <div className="ddv-form-actions">
                  <button className="ddv-save-btn" onClick={saveProfile} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                  <button className="ddv-cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="ddv-sec-header">
                  <div className="ddv-sec-title"><div className="ddv-sec-dot" />Doctor Information</div>
                </div>
                {doctor?.bio && (
                  <div style={{ background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: 12, padding: '14px 16px', marginBottom: 16 }}>
                    <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px', color: '#9ca3af', marginBottom: 6 }}>About</div>
                    <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.7 }}>{doctor.bio}</div>
                  </div>
                )}
                <div className="ddv-info-grid">
                  {[['📛 Full Name',doctor?.name||'—'],['🎓 Qualification',doctor?.qualification||'—'],['🩺 Specialization',doctor?.specialization||'—'],['📞 Phone',doctor?.phone||'—'],['📧 Email',doctor?.email||'—'],['⚡ Status',doctor?.status||'Active'],['🏆 Experience',`${doctor?.experience||0} years`],['💰 Fee',`₹${Number(doctor?.fee||0).toLocaleString('en-IN')}`]].map(([label, value]) => (
                    <div key={label} className="ddv-info-cell">
                      <div className="ddv-info-label">{label}</div>
                      <div className="ddv-info-value">{value}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Schedule → ScheduleManager */}
        {activeTab === 'schedule' && (
          <div className="ddv-panel">
            <ScheduleManager docId={docId} schedules={doctor?.schedules || []} />
          </div>
        )}

        {/* Patients → PatientAssignments */}
        {activeTab === 'patients' && (
          <div className="ddv-panel">
            <PatientAssignments docId={docId} />
          </div>
        )}

        {/* Leaves → LeaveManager */}
        {activeTab === 'leaves' && (
          <div className="ddv-panel">
            <LeaveManager docId={docId} leaves={doctor?.leaves || []} onUpdate={reload} />
          </div>
        )}

        {/* Ratings → RatingsPanel */}
        {activeTab === 'ratings' && (
          <div className="ddv-panel">
            <RatingsPanel doctorId={docId} ratings={doctor?.ratings || []} avgRating={doctor?.avg_rating || 0} onUpdate={handleRatingsUpdate} />
          </div>
        )}
      </div>
    </>
  );
}