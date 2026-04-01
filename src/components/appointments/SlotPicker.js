'use client';
import { useState, useEffect } from 'react';

export default function SlotPicker({ doctorId, date, selectedSlot, onSelect }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!doctorId || !date) { setData(null); return; }
    setLoading(true);
    onSelect(''); // clear previous selection
    fetch(`/api/appointments/slots?doctor_id=${doctorId}&date=${date}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [doctorId, date]);

  if (!doctorId || !date) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .sp-wrap { font-family: 'Plus Jakarta Sans', sans-serif; margin-top: 16px; }
        .sp-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .sp-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #6366f1; }
        .sp-meta { font-size: 11px; color: #9ca3af; font-weight: 500; }
        .sp-loading { display: flex; align-items: center; gap: 8px; padding: 16px; background: #fafafe; border-radius: 12px; border: 1px solid rgba(99,102,241,0.1); }
        .sp-spin { width: 16px; height: 16px; border: 2px solid rgba(99,102,241,0.2); border-top-color: #6366f1; border-radius: 50%; animation: sp-spin 0.7s linear infinite; }
        @keyframes sp-spin { to { transform: rotate(360deg); } }
        .sp-spin-text { font-size: 13px; color: #9ca3af; font-weight: 500; }
        .sp-unavailable { padding: 14px 16px; background: rgba(239,68,68,0.05); border: 1px solid rgba(239,68,68,0.15); border-radius: 12px; display: flex; align-items: center; gap: 8px; }
        .sp-unavail-icon { font-size: 16px; }
        .sp-unavail-text { font-size: 13px; color: #dc2626; font-weight: 600; }
        .sp-unavail-sub { font-size: 11.5px; color: #f87171; font-weight: 400; }
        .sp-info-bar { display: flex; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; }
        .sp-info-chip { display: flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; }
        .sp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 8px; }
        .sp-slot {
          padding: 10px 6px; border-radius: 11px; font-size: 12.5px; font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer;
          transition: all 0.18s cubic-bezier(0.34,1.56,0.64,1);
          border: 1.5px solid; text-align: center; position: relative;
          display: flex; flex-direction: column; align-items: center; gap: 3px;
        }
        .sp-slot-time { font-size: 13px; font-weight: 700; }
        .sp-slot-tag { font-size: 9px; font-weight: 600; letter-spacing: 0.3px; opacity: 0.8; }
        .sp-slot-free { background: white; border-color: rgba(99,102,241,0.2); color: #4f46e5; }
        .sp-slot-free:hover { background: rgba(99,102,241,0.08); border-color: #6366f1; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(99,102,241,0.15); }
        .sp-slot-selected { background: linear-gradient(135deg,#6366f1,#4f46e5); border-color: transparent; color: white; box-shadow: 0 4px 14px rgba(99,102,241,0.4); transform: translateY(-2px) scale(1.03); }
        .sp-slot-selected .sp-slot-tag { opacity: 0.8; }
        .sp-slot-booked { background: rgba(239,68,68,0.05); border-color: rgba(239,68,68,0.15); color: #fca5a5; cursor: not-allowed; }
        .sp-slot-past { background: rgba(107,114,128,0.05); border-color: rgba(107,114,128,0.12); color: #d1d5db; cursor: not-allowed; }
        .sp-selected-banner { margin-top: 14px; padding: 12px 16px; background: rgba(99,102,241,0.08); border: 1.5px solid rgba(99,102,241,0.25); border-radius: 12px; display: flex; align-items: center; gap: 10px; }
        .sp-selected-check { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg,#6366f1,#4f46e5); color: white; font-size: 14px; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 8px rgba(99,102,241,0.3); flex-shrink: 0; }
        .sp-selected-text { font-size: 13px; font-weight: 700; color: #1e1b4b; }
        .sp-selected-sub { font-size: 11px; color: #6366f1; font-weight: 500; }
        .sp-legend { display: flex; gap: 14px; margin-top: 12px; flex-wrap: wrap; }
        .sp-legend-item { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #9ca3af; font-weight: 500; }
        .sp-legend-dot { width: 10px; height: 10px; border-radius: 3px; border: 1.5px solid; }
      `}</style>

      <div className="sp-wrap">
        <div className="sp-header">
          <span className="sp-title">⏰ Available Time Slots</span>
          {data?.available && (
            <span className="sp-meta">{data.free} of {data.total} slots free</span>
          )}
        </div>

        {loading && (
          <div className="sp-loading">
            <div className="sp-spin" />
            <span className="sp-spin-text">Checking availability...</span>
          </div>
        )}

        {!loading && data && !data.available && (
          <div className="sp-unavailable">
            <span className="sp-unavail-icon">🚫</span>
            <div>
              <div className="sp-unavail-text">Not available</div>
              <div className="sp-unavail-sub">{data.reason}</div>
            </div>
          </div>
        )}

        {!loading && data?.available && (
          <>
            <div className="sp-info-bar">
              <span className="sp-info-chip" style={{ background:'rgba(99,102,241,0.08)', color:'#4f46e5' }}>
                📅 {data.day}
              </span>
              <span className="sp-info-chip" style={{ background:'rgba(16,185,129,0.08)', color:'#059669' }}>
                🕐 {formatTime12(data.schedule.start)} – {formatTime12(data.schedule.end)}
              </span>
              <span className="sp-info-chip" style={{ background:'rgba(245,158,11,0.08)', color:'#d97706' }}>
                ⏱ {data.schedule.slot_duration} min slots
              </span>
            </div>

            {data.slots.length === 0 ? (
              <div className="sp-unavailable">
                <span className="sp-unavail-icon">😔</span>
                <div>
                  <div className="sp-unavail-text">No slots available</div>
                  <div className="sp-unavail-sub">All slots are booked for this day</div>
                </div>
              </div>
            ) : (
              <div className="sp-grid">
                {data.slots.map(slot => {
                  const isSelected = selectedSlot === slot.time;
                  let cls = 'sp-slot ';
                  if (isSelected) cls += 'sp-slot-selected';
                  else if (slot.booked) cls += 'sp-slot-booked';
                  else if (slot.past) cls += 'sp-slot-past';
                  else cls += 'sp-slot-free';

                  return (
                    <button
                      key={slot.time}
                      className={cls}
                      disabled={slot.booked || slot.past}
                      onClick={() => onSelect(isSelected ? '' : slot.time)}
                    >
                      <span className="sp-slot-time">{slot.label}</span>
                      <span className="sp-slot-tag">
                        {isSelected ? '✓ Selected' : slot.booked ? 'Booked' : slot.past ? 'Passed' : 'Free'}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="sp-legend">
              <div className="sp-legend-item"><div className="sp-legend-dot" style={{ background:'rgba(99,102,241,0.08)', borderColor:'rgba(99,102,241,0.2)' }} />Available</div>
              <div className="sp-legend-item"><div className="sp-legend-dot" style={{ background:'linear-gradient(135deg,#6366f1,#4f46e5)', borderColor:'transparent' }} />Selected</div>
              <div className="sp-legend-item"><div className="sp-legend-dot" style={{ background:'rgba(239,68,68,0.05)', borderColor:'rgba(239,68,68,0.15)' }} />Booked</div>
              <div className="sp-legend-item"><div className="sp-legend-dot" style={{ background:'rgba(107,114,128,0.05)', borderColor:'rgba(107,114,128,0.12)' }} />Passed</div>
            </div>
          </>
        )}

        {selectedSlot && (
          <div className="sp-selected-banner">
            <div className="sp-selected-check">✓</div>
            <div>
              <div className="sp-selected-text">Slot confirmed: {formatTime12(selectedSlot)}</div>
              <div className="sp-selected-sub">Click another slot to change, or proceed to book</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function formatTime12(time24) {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
}