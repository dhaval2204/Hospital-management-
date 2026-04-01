"use client";

export default function PatientForm({ form, setForm, onSubmit, editId }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .pf-card {
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
        .pf-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4);
        }
        .pf-title {
          font-size: 16px;
          font-weight: 700;
          color: #1e1b4b;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .pf-title-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
        }
        .pf-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 14px;
          margin-bottom: 18px;
        }
        .pf-field label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.7px;
          text-transform: uppercase;
          color: #6366f1;
          margin-bottom: 6px;
        }
        .pf-input {
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
        .pf-input:focus {
          border-color: #6366f1;
          background: white;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
        }
        .pf-input::placeholder { color: #a5b4fc; }
        .pf-submit {
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
        .pf-submit:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 8px 20px rgba(99,102,241,0.4);
        }
        .pf-submit:active { transform: scale(0.98); }
      `}</style>

      <div className="pf-card">
        <div className="pf-title">
          <div className="pf-title-dot" />
          {editId ? "Edit Patient" : "Add New Patient"}
        </div>
        <div className="pf-grid">
          <div className="pf-field">
            <label>Full Name</label>
            <input
              className="pf-input"
              placeholder="e.g. Rahul Sharma"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="pf-field">
            <label>Age</label>
            <input
              className="pf-input"
              placeholder="e.g. 35"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
            />
          </div>
          <div className="pf-field">
            <label>Disease / Condition</label>
            <input
              className="pf-input"
              placeholder="e.g. Diabetes"
              value={form.disease}
              onChange={(e) => setForm({ ...form, disease: e.target.value })}
            />
          </div>
          {/* ✅ NEW FIELDS */}

          <div className="pf-field">
            <label>Blood Group</label>
            <input
              className="pf-input"
              placeholder="e.g. A+"
              value={form.blood_group || ""}
              onChange={(e) => setForm({ ...form, blood_group: e.target.value })}
            />
          </div>

          <div className="pf-field">
            <label>Phone</label>
            <input
              className="pf-input"
              placeholder="e.g. 8887543226"
              value={form.phone || ""}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div className="pf-field">
            <label>Email</label>
            <input
              className="pf-input"
              placeholder="xyz@gmail.com"
              value={form.email || ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="pf-field">
            <label>Gender</label>
            <input
              className="pf-input"
              placeholder="e.g. Male"
              value={form.gender || ""}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            />
          </div>

          <div className="pf-field">
            <label>Address</label>
            <input
              className="pf-input"
              placeholder="e.g. Ahemedabad"
              value={form.address || ""}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
        </div>
        <button className="pf-submit" onClick={onSubmit}>
          {editId ? "Update Patient" : "Add Patient"}
        </button>
      </div>
    </>
  );
}