"use client";

import { useEffect, useState } from "react";
import AppointmentsLine from "@/components/dashboard/LineChart";
import DoctorBar from "@/components/dashboard/BarChart";
import StatusPie from "@/components/dashboard/Piechart";
import { Users, User, Calendar, Clock } from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then(setData);
  }, []);

  // --- LOADING / SKELETON STATE ---
  if (!data)
    return (
      <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded-lg mb-8" />

        {/* Responsive Skeleton Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-gray-200 animate-pulse" />
          ))}
        </div>

        {/* Responsive Skeleton Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-80 bg-gray-200 rounded-2xl animate-pulse lg:col-span-2" />
          <div className="h-80 bg-gray-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    );

  // --- ACTIVE DASHBOARD STATE ---
  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back to MediCore HMS</p>
      </header>

      {/* 🔥 STATS CARDS: 1 col on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <Card title="Total Patients" value={data?.counts?.patients || 0} type="patients" />
        <Card title="Active Doctors" value={data?.counts?.doctors || 0} type="doctors" />
        <Card title="Today's Appointments" value={data?.counts?.today || 0} type="today" />
        <Card title="Pending Requests" value={data?.counts?.pending || 0} type="pending" />
      </div>

      {/* 🔥 CHARTS SECTION: Responsive Grid for 3 components */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Trend Chart - Takes 2/3 width on large screens */}
        <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="text-lg font-semibold mb-4 text-gray-700">Appointment Trends</h3>
           <div className="h-[300px] w-full">
              <AppointmentsLine data={data?.daily || []} />
           </div>
        </div>

        {/* Status Pie - Takes 1/3 width */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="text-lg font-semibold mb-4 text-gray-700">Status Distribution</h3>
           <div className="h-[300px] w-full">
              <StatusPie data={data?.status || []} />
           </div>
        </div>

        {/* Doctor Load - Full width on bottom on large screens or stackable */}
        <div className="lg:col-span-3 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="text-lg font-semibold mb-4 text-gray-700">Doctor Workload</h3>
           <div className="h-[300px] w-full">
              <DoctorBar data={data?.doctorLoad || []} />
           </div>
        </div>
      </div>
    </div>
  );
}

/* 🔥 RESPONSIVE CARD COMPONENT */
function Card({ title, value, type }) {
  const icons = {
    patients: <Users className="w-8 h-8 md:w-10 md:h-10" />,
    doctors: <User className="w-8 h-8 md:w-10 md:h-10" />,
    today: <Calendar className="w-8 h-8 md:w-10 md:h-10" />,
    pending: <Clock className="w-8 h-8 md:w-10 md:h-10" />,
  };

  const colors = {
    patients: "from-blue-600 to-indigo-700",
    doctors: "from-emerald-500 to-teal-600",
    today: "from-violet-500 to-purple-600",
    pending: "from-rose-500 to-red-600",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-md bg-gradient-to-br ${
        colors[type] || "from-slate-600 to-slate-700"
      } transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
    >
      {/* Background Icon Decoration */}
      <div className="absolute -top-2 -right-2 opacity-15 rotate-12">
        {icons[type]}
      </div>

      <div className="relative z-10">
        <p className="text-xs md:text-sm font-medium uppercase tracking-wider opacity-90">
          {title}
        </p>
        <div className="flex items-end justify-between mt-3">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {value}
          </h2>
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
            {/* Small icon for context */}
            {icons[type] && <div className="scale-50 origin-center">{icons[type]}</div>}
          </div>
        </div>
      </div>

      {/* Decorative glass effect bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10" />
    </div>
  );
}