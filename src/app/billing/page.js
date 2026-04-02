"use client";
import { useEffect, useState } from "react";

export default function Billing() {
  const [data, setData] = useState([]);

  const fetchData = () => {
    fetch("/api/billing").then(res => res.json()).then(setData);
  };
  useEffect(() => { fetchData(); }, []);

  const markPaid = async (id) => {
    await fetch(`/api/billing/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Paid" }),
    });
    fetchData();
  };

  const total   = data.reduce((s, b) => s + Number(b.amount || 0), 0);
  const paid    = data.filter(b => b.status === "Paid").reduce((s, b) => s + Number(b.amount || 0), 0);
  const pending = total - paid;

  const stats = [
    { label:'Total Billed', val:`₹${total.toLocaleString("en-IN")}`,   bar:'bg-indigo-500' },
    { label:'Collected',    val:`₹${paid.toLocaleString("en-IN")}`,    bar:'bg-emerald-500' },
    { label:'Pending',      val:`₹${pending.toLocaleString("en-IN")}`, bar:'bg-amber-400' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-extrabold text-indigo-950 tracking-tight">
          💳 Billing <span className="text-indigo-500">&amp; Payments</span>
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {stats.map(({ label, val, bar }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-indigo-50 shadow-sm relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-1 ${bar} rounded-t-2xl`} />
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{label}</div>
            <div className="text-2xl font-extrabold tracking-tight text-indigo-950">{val}</div>
          </div>
        ))}
      </div>

      {/* Table — scrollable on mobile */}
      <div className="bg-white rounded-2xl border border-indigo-50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[600px]">
            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <tr>
                {['Patient','Doctor','Amount','Status','Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10.5px] font-bold uppercase tracking-widest text-indigo-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-indigo-300 font-semibold text-sm">
                    No billing records yet
                  </td>
                </tr>
              ) : data.map((b) => (
                <tr key={b.id} className="border-t border-indigo-50 hover:bg-indigo-50/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">👤 {b.patient_name}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">🩺 {b.doctor_name}</td>
                  <td className="px-4 py-3">
                    <span className="text-base font-extrabold text-indigo-950">
                      ₹{Number(b.amount).toLocaleString("en-IN")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {b.status === "Paid" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {b.status === "Pending" && (
                      <button
                        onClick={() => markPaid(b.id)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-green-600 shadow-sm shadow-emerald-200 hover:shadow-md hover:-translate-y-0.5 transition-all"
                      >
                        ✓ Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}