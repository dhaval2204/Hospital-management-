'use client';
import { useState, useEffect } from 'react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function buildSchedule(schedulesArr) {
  const map = {};
  (schedulesArr || []).forEach(s => { map[s.day_of_week] = s; });
  return DAYS.map(day => map[day] || {
    day_of_week: day,
    start_time: '09:00',
    end_time: '17:00',
    slot_duration_mins: 30,
    is_available: false,
  });
}

export default function ScheduleManager({ docId, schedules: initialSchedules }) {
  const [schedule, setSchedule] = useState(() => buildSchedule(initialSchedules));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSchedule(buildSchedule(initialSchedules));
  }, [initialSchedules]);

  const updateDay = (idx, field, val) =>
    setSchedule(prev => prev.map((d, i) => i === idx ? { ...d, [field]: val } : d));

  const saveSchedule = async () => {
    setSaving(true);
    await fetch(`/api/doctors/${docId}/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(schedule),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .sm-wrap * { box-sizing: border-box; }
        .sm-wrap { font-family: 'Plus Jakarta Sans', sans-serif; }
        .sm-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .sm-title { font-size: 15px; font-weight: 700; color: #1e1b4b; display: flex; align-items: center; gap: 8px; }
        .sm-dot { width: 7px; height: 7px; border-radius: 50%; background: linear-gradient(135deg,#6366f1,#8b5cf6); flex-shrink: 0; }
        .sm-save-btn { padding: 9px 20px; background: linear-gradient(135deg,#6366f1,#4f46e5); color: white; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; font-family: 'Plus Jakarta Sans',sans-serif; cursor: pointer; box-shadow: 0 3px 10px rgba(99,102,241,0.3); transition: all 0.2s; display: flex; align-items: center; gap: 6px; }
        .sm-save-btn:hover:not(:disabled) { transform: translateY(-1px); }
        .sm-save-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .sm-save-btn.saved { background: linear-gradient(135deg,#10b981,#059669); box-shadow: 0 3px 10px rgba(16,185,129,0.3); }
        .sm-table { width: 100%; border-collapse: collapse; }
        .sm-table th { padding: 11px 14px; text-align: left; font-size: 10.5px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #6366f1; background: linear-gradient(135deg,#f5f3ff,#ede9fe); }
        .sm-table th:first-child { border-radius: 10px 0 0 10px; }
        .sm-table th:last-child { border-radius: 0 10px 10px 0; }
        .sm-table td { padding: 12px 14px; font-size: 13.5px; font-weight: 500; color: #374151; border-top: 1px solid rgba(99,102,241,0.06); vertical-align: middle; }
        .sm-row { transition: all 0.25s ease; }
        .sm-row:hover td { background: rgba(99,102,241,0.015); }
        .sm-time-input { padding: 7px 10px; border: 1.5px solid rgba(99,102,241,0.18); border-radius: 8px; font-size: 13px; font-family: 'Plus Jakarta Sans',sans-serif; color: #1e1b4b; background: white; outline: none; width: 120px; text-align: center; transition: all 0.2s; }
        .sm-time-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        .sm-slot-select { padding: 6px 10px; border: 1.5px solid rgba(99,102,241,0.18); border-radius: 8px; font-size: 13px; font-family: 'Plus Jakarta Sans',sans-serif; color: #1e1b4b; background: white; outline: none; }
        .sm-toggle { position: relative; width: 42px; height: 22px; }
        .sm-toggle input { opacity: 0; width: 0; height: 0; }
        .sm-slider { position: absolute; cursor: pointer; inset: 0; background: #e5e7eb; border-radius: 999px; transition: all 0.3s ease; }
        .sm-slider:before { content:''; position:absolute; height:16px; width:16px; left:3px; bottom:3px; background:white; border-radius:50%; transition:all 0.3s ease; box-shadow:0 2px 6px rgba(0,0,0,0.2); }
        .sm-toggle input:checked + .sm-slider { background: linear-gradient(135deg,#6366f1,#4f46e5); box-shadow: 0 0 10px rgba(99,102,241,0.4); }
        .sm-toggle input:checked + .sm-slider:before { transform: translateX(20px); }
        .sm-status-lbl { font-size: 11px; font-weight: 700; }
        .sm-day-lbl { font-weight: 700; color: #1e1b4b; }
      `}</style>
      <div className="sm-wrap">
        <div className="sm-header">
          <div className="sm-title"><div className="sm-dot" />Weekly Schedule</div>
          <button
            className={`sm-save-btn${saved ? ' saved' : ''}`}
            onClick={saveSchedule}
            disabled={saving}
          >
            {saving ? '⏳ Saving...' : saved ? '✓ Saved!' : '💾 Save Schedule'}
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="sm-table">
            <thead>
              <tr>
                <th>Day</th>
                <th style={{ textAlign: 'center' }}>Start Time</th>
                <th style={{ textAlign: 'center' }}>End Time</th>
                <th style={{ textAlign: 'center' }}>Slot (min)</th>
                <th style={{ textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((s, i) => (
                <tr
                  key={s.day_of_week}
                  className="sm-row"
                  style={{
                    background: s.is_available
                      ? 'linear-gradient(135deg,rgba(99,102,241,0.04),rgba(139,92,246,0.04))'
                      : '#fafafa',
                    borderLeft: s.is_available ? '3px solid #6366f1' : '3px solid transparent',
                    opacity: s.is_available ? 1 : 0.65,
                  }}
                >
                  <td className="sm-day-lbl">{s.day_of_week}</td>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="time"
                      className="sm-time-input"
                      value={s.start_time?.slice(0, 5) || '09:00'}
                      onChange={e => updateDay(i, 'start_time', e.target.value)}
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="time"
                      className="sm-time-input"
                      value={s.end_time?.slice(0, 5) || '17:00'}
                      onChange={e => updateDay(i, 'end_time', e.target.value)}
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <select
                      className="sm-slot-select"
                      value={s.slot_duration_mins || 30}
                      onChange={e => updateDay(i, 'slot_duration_mins', Number(e.target.value))}
                    >
                      {[15, 20, 30, 45, 60].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                      <label className="sm-toggle">
                        <input
                          type="checkbox"
                          checked={!!s.is_available}
                          onChange={e => updateDay(i, 'is_available', e.target.checked)}
                        />
                        <span className="sm-slider" />
                      </label>
                      <span className="sm-status-lbl" style={{ color: s.is_available ? '#4f46e5' : '#9ca3af' }}>
                        {s.is_available ? 'Active' : 'Off'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}