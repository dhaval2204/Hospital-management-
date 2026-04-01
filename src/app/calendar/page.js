"use client";

import { useEffect, useState } from "react";
import CalendarView from "@/components/appointments/CalendarView";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = () => {
    setLoading(true);
    fetch("/api/appointments")
      .then(res => res.json())
      .then(data => {
        setEvents(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchEvents(); }, []);

  // Drag to reschedule — updates appointment_date + appointment_time
  const handleEventDrop = async (id, newDate, newTime) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointment_date: newDate, appointment_time: newTime }),
      });
      if (res.ok) {
        fetchEvents(); // refresh
      }
    } catch (err) {
      console.error("Reschedule failed:", err);
    }
  };

  // Status change from event modal
  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        // Optimistically update local state too
        setEvents(prev =>
          prev.map(e => e.id === id ? { ...e, status } : e)
        );
      }
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .cp-root { font-family: 'Plus Jakarta Sans', sans-serif; }
        .cp-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; flex-wrap: wrap; gap: 12px; }
        .cp-title { font-size: 24px; font-weight: 800; color: #1e1b4b; letter-spacing: -0.5px; }
        .cp-sub { font-size: 13px; color: #6b7280; font-weight: 500; margin-top: 2px; }
        .cp-refresh { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 10px; border: 1.5px solid rgba(99,102,241,0.25); background: rgba(99,102,241,0.06); color: #4f46e5; font-size: 13px; font-weight: 700; font-family: 'Plus Jakarta Sans',sans-serif; cursor: pointer; transition: all 0.2s; }
        .cp-refresh:hover { background: rgba(99,102,241,0.12); transform: translateY(-1px); }
        .cp-loading { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 80px; background: white; border-radius: 20px; border: 1px solid rgba(99,102,241,0.1); }
        .cp-spin { width: 28px; height: 28px; border: 3px solid rgba(99,102,241,0.15); border-top-color: #6366f1; border-radius: 50%; animation: cp-spin 0.8s linear infinite; }
        @keyframes cp-spin { to { transform: rotate(360deg); } }
        .cp-spin-text { font-size: 14px; color: #6b7280; font-weight: 600; }
      `}</style>

      <div className="cp-root">
        <div className="cp-header">
          <div>
            <div className="cp-title">📅 Calendar</div>
            <div className="cp-sub">{events.length} appointment{events.length !== 1 ? "s" : ""} scheduled</div>
          </div>
          <button className="cp-refresh" onClick={fetchEvents}>🔄 Refresh</button>
        </div>

        {loading ? (
          <div className="cp-loading">
            <div className="cp-spin" />
            <span className="cp-spin-text">Loading calendar...</span>
          </div>
        ) : (
          <CalendarView
            events={events}
            onEventDrop={handleEventDrop}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </>
  );
}