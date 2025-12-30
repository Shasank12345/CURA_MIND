import React, { useState, useEffect } from "react";
import axios from "axios";
import DoctorResponse1 from "./DoctorResponse1"; // Pending Requests
import DoctorDetail from "./DoctorDetail"; // Verified Doctors

export default function Dashboard() {
  const [stats, setStats] = useState({ pending_verifications: 0, total_doctors: 0, total_patients: 0 });

  const fetchStats = () => {
    axios.get("http://localhost:5000/admin/dashboard_stats", { withCredentials: true })
      .then(res => setStats(res.data))
      .catch(err => console.error("Stats fetch failed", err));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin Control Center</h1>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 shadow rounded-lg border-l-4 border-yellow-500">
          <p className="text-gray-500 text-sm">Pending Verifications</p>
          <p className="text-2xl font-bold">{stats.pending_verifications}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg border-l-4 border-green-500">
          <p className="text-gray-500 text-sm">Verified Doctors</p>
          <p className="text-2xl font-bold">{stats.total_doctors}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm">Total Patients</p>
          <p className="text-2xl font-bold">{stats.total_patients}</p>
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-orange-700">Pending Approval Requests</h2>
          <DoctorResponse1 onAction={fetchStats} />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-green-700">Verified Doctor Directory</h2>
          <DoctorDetail />
        </section>
      </div>
    </div>
  );
}