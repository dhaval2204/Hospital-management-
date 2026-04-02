"use client";
import { useEffect, useState } from "react";

const STATUS_STYLES = {
  Pending:   { bg:'bg-amber-50',   text:'text-amber-700',   border:'border-amber-200',   dot:'bg-amber-400' },
  Approved:  { bg:'bg-indigo-50',  text:'text-indigo-700',  border:'border-indigo-200',  dot:'bg-indigo-500' },
  Completed: { bg:'bg-emerald-50', text:'text-emerald-700', border:'border-emerald-200', dot:'bg-emerald-500' },
  Cancelled: { bg:'bg-red-50',     text:'text-red-700',     border:'border-red-200',     dot:'bg-red-400' },
};

export default function MyAppointments() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("All");

  const fetchData = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;
    fetch(`/api/new-appointments/${user.id}`).then(res => res.json()).then(setData);
  };
  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (id, status) => {
    await fetch(`/api/new-appointments/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (status === "Completed") {
      await fetch("/api/billing", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointment_id: id }),
      });
    }
    fetchData();
  };

  const filters = ["All", "Pending", "Completed", "Cancelled"];
  const filteredData = filter === "All" ? data : data.filter(a => a.status === filter);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-extrabold text-indigo-950 tracking-tight">🩺 My Appointments</h1>

        {/* Filter pills */}
        <div className="flex gap-1.5 bg-white p-1.5 rounded-xl border border-indigo-100 shadow-sm flex-wrap">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === f
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-sm shadow-indigo-200'
                  : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table — scrollable on mobile */}
      <div className="bg-white rounded-2xl border border-indigo-50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[560px]">
            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <tr>
                {['Patient','Date & Time','Status','Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10.5px] font-bold uppercase tracking-widest text-indigo-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? filteredData.map(a => {
                const s = STATUS_STYLES[a.status] || STATUS_STYLES.Pending;
                return (
                  <tr key={a.id} className="border-t border-indigo-50 hover:bg-indigo-50/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-bold text-indigo-950 text-sm">👤 {a.patient_name}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(a.appointment_date).toLocaleString("en-IN", {
                        day:"2-digit", month:"short", year:"numeric",
                        hour:"2-digit", minute:"2-digit"
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${s.bg} ${s.text} ${s.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />{a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 flex-wrap">
                        {a.status === "Pending" && (
                          <>
                            <button
                              onClick={() => updateStatus(a.id, "Completed")}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-sm hover:-translate-y-0.5 transition-all"
                            >✓ Accept</button>
                            <button
                              onClick={() => updateStatus(a.id, "Cancelled")}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-all"
                            >✕ Reject</button>
                          </>
                        )}
                        {a.status === "Approved" && (
                          <button
                            onClick={() => updateStatus(a.id, "Completed")}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-green-600 shadow-sm hover:-translate-y-0.5 transition-all"
                          >✓ Complete</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-indigo-300 font-semibold text-sm">
                    📋 No appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}