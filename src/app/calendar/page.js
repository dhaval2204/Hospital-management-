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
      .then(data => { setEvents(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(() => { fetchEvents(); }, []);

  const handleEventDrop = async (id, newDate, newTime) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointment_date: newDate, appointment_time: newTime }),
      });
      if (res.ok) fetchEvents();
    } catch (err) { console.error("Reschedule failed:", err); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) setEvents(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    } catch (err) { console.error("Status update failed:", err); }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-indigo-950 tracking-tight">📅 Calendar</h1>
          <p className="text-sm text-gray-500 font-medium mt-0.5">
            {events.length} appointment{events.length !== 1 ? "s" : ""} scheduled
          </p>
        </div>
        <button
          onClick={fetchEvents}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-[1.5px] border-indigo-200 bg-indigo-50 text-indigo-600 text-sm font-bold hover:bg-indigo-100 hover:-translate-y-0.5 transition-all"
        >
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-3 py-20 bg-white rounded-2xl border border-indigo-50 shadow-sm">
          <div className="w-7 h-7 rounded-full border-[3px] border-indigo-100 border-t-indigo-500 animate-spin" />
          <span className="text-sm text-gray-500 font-semibold">Loading calendar...</span>
        </div>
      ) : (
        <CalendarView
          events={events}
          onEventDrop={handleEventDrop}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}