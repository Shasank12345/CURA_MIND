import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DoctorDetail() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("http://localhost:5000/admin/get_doctors/verified", { 
          withCredentials: true 
        });
        setDoctors(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div className="p-6">
      <table className="w-full bg-white rounded-xl overflow-hidden shadow">
        <thead className="bg-purple-50 text-purple-700 uppercase text-xs">
          <tr>
            <th className="p-4 text-left">S.N</th>
            <th className="p-4 text-left">Full Name</th>
            <th className="p-4 text-left">Specialization</th>
            <th className="p-4 text-left">License No</th>
            <th className="p-4 text-left">Phone</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doc, index) => (
            <tr key={doc.id} className="border-b hover:bg-gray-50">
              <td className="p-4 text-sm">{index + 1}</td>
              {/* These keys MUST match admin.py exactly */}
              <td className="p-4 text-sm font-bold">{doc.name}</td> 
              <td className="p-4 text-sm">{doc.specialization}</td>
              <td className="p-4 text-sm font-mono">{doc.licenseNo}</td>
              <td className="p-4 text-sm">{doc.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}