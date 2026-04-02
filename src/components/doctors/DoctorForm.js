"use client";

export default function DoctorForm({ form, setForm, onSubmit, editId }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .df-card {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: white;
          border-radius: 20px;
          padding: 28px 28px 24px;
          margin-bottom: 24px;
          border: 1px solid rgba(99,102,241,0.1);
          box-shadow: 0 4px 24px rgba(99,102,241,0.06);
          position: relative;
          overflow: hidden;
        }
        .df-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6, #10b981);
        }
        .df-title {
          font-size: 16px;
          font-weight: 700;
          color: #1e1b4b;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .df-title-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
        }
        .df-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 18px;
        }
        .df-field label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.7px;
          text-transform: uppercase;
          color: #6366f1;
          margin-bottom: 6px;
        }
        .df-input {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid rgba(99,102,241,0.18);
          border-radius: 11px;
          font-size: 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 500;
          color: #1e1b4b;
          background: #fafafe;
          transition: all 0.2s ease;
          outline: none;
          box-sizing: border-box;
        }
        .df-input:focus {
          border-color: #6366f1;
          background: white;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
        }
        .df-input::placeholder { color: #a5b4fc; }
        .df-submit {
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: white;
          border: none;
          padding: 11px 28px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow: 0 4px 14px rgba(99,102,241,0.35);
          letter-spacing: 0.3px;
        }
        .df-submit:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 8px 20px rgba(99,102,241,0.4);
        }
        .df-submit:active { transform: scale(0.98); }
@media (max-width: 640px) {
  .df-card { padding: 20px 16px; }
  .df-grid { grid-template-columns: 1fr; }
}

      `}</style>

      <div className="df-card">
        <div className="df-title">
          <div className="df-title-dot" />
          {editId ? "Edit Doctor" : "Add New Doctor"}
        </div>

        <div className="df-grid">
          <div className="df-field">
            <label>Full Name</label>
            <input
              className="df-input"
              placeholder="e.g. Dr. Arjun Mehta"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="df-field">
            <label>Specialization</label>
            <input
              className="df-input"
              placeholder="e.g. Cardiologist"
              value={form.specialization}
              onChange={(e) => setForm({ ...form, specialization: e.target.value })}
            />
          </div>

          <div className="df-field">
            <label>Phone Number</label>
            <input
              className="df-input"
              placeholder="e.g. +91 98765 43210"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div className="df-field">
            <label>Experience (Years)</label>
            <input
              className="df-input"
              placeholder="e.g. 8"
              value={form.experience}
              onChange={(e) => setForm({ ...form, experience: e.target.value })}
            />
          </div>
        </div>

        <button className="df-submit" onClick={onSubmit}>
          {editId ? "Update Doctor" : "Add Doctor"}
        </button>
      </div>
    </>
  );
}