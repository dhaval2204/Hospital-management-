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
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {/* 🔥 CARD SKELETON */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 rounded-2xl bg-gray-200 animate-pulse"
            />
          ))}
        </div>

        {/* 🔥 CHART SKELETON */}
        <div className="grid grid-cols-2 gap-6">
          <div className="h-72 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-72 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>
    );


  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* 🔥 CARDS */}
     <div className="grid grid-cols-4 gap-4 mb-6">
  <Card title="Patients" value={data?.counts?.patients || 0} type="patients" />
  <Card title="Doctors" value={data?.counts?.doctors || 0} type="doctors" />
  <Card title="Today" value={data?.counts?.today || 0} type="today" />
  <Card title="Pending" value={data?.counts?.pending || 0} type="pending" />
</div>

      {/* 🔥 CHARTS */}
      <div className="grid grid-cols-2 gap-6">
    <AppointmentsLine data={data?.daily || []} />
<DoctorBar data={data?.doctorLoad || []} />
<StatusPie data={data?.status || []} />
      </div>
    </div>
  );
}

/* 🔥 IMPROVED CARD */
function Card({ title, value, type }) {
  const icons = {
    patients: <Users size={22} />,
    doctors: <User size={22} />,
    today: <Calendar size={22} />,
    pending: <Clock size={22} />,
  };

  const colors = {
    patients: "from-blue-500 to-blue-600",
    doctors: "from-green-500 to-green-600",
    today: "from-purple-500 to-purple-600",
    pending: "from-red-500 to-red-600",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-lg bg-gradient-to-r ${
        colors[type] || "from-gray-500 to-gray-600"
      } transition transform hover:scale-[1.03] hover:shadow-xl`}
    >
      {/* ICON */}
      <div className="absolute top-4 right-4 opacity-20">
        {icons[type]}
      </div>

      {/* CONTENT */}
      <p className="text-sm opacity-80">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>

      {/* BOTTOM LINE */}
      <div className="mt-4 h-[2px] bg-white/30 rounded"></div>
    </div>
  );
}