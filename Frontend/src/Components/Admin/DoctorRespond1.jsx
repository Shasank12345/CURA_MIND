import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Demo2() {
  const navigate = useNavigate();

  const [doctorData] = useState([
    {
      id: 1,
      name: "John Doe",
      licenseNo: "DL-998877",
      specification: "Cardiologist",
      email: "john@example.com",
    },
    {
      id: 2,
      name: "Jane Smith",
      licenseNo: "DL-554433",
      specification: "Dermatologist",
      email: "jane@example.com",
    },
    {
      id: 3,
      name: "Basanta",
      licenseNo: "DL-778899",
      specification: "Dermatologist",
      email: "basanta@example.com",
    },
  ]);

  return (
    <div className="p-4 pt-[60px] bg-gray-100 min-h-screen">
      <h2 className="text-xl font-bold mb-6 text-center">DOCTOR LIST</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
        {doctorData.map((doctor) => (
          <div
            key={doctor.id}
            className="relative group border p-6 shadow-lg rounded-lg max-w-sm w-full
                       bg-gradient-to-br from-purple-100 to-yellow-100 overflow-hidden"
          >
            <h3 className="text-lg font-semibold mb-2">
              {doctor.name || 'No Name'}
            </h3>

            <p className="mb-1">
              <strong>Email:</strong> {doctor.email || 'N/A'}
            </p>

            <p className="mb-1">
              <strong>License No:</strong> {doctor.licenseNo || 'N/A'}
            </p>

            <p>
              <strong>Specification:</strong> {doctor.specification || 'N/A'}
            </p>

            <div
              className="absolute inset-0 flex items-center justify-center
                         bg-black/40 backdrop-blur-md rounded-lg z-10
                         opacity-0 group-hover:opacity-100
                         transition-opacity duration-300"
            >
              <button
                onClick={() =>
                  navigate('/adminpannel/doctorrespond2', { state: doctor })
                }
                className="bg-blue-500 text-white px-4 py-2 rounded-lg
                           hover:bg-blue-600 transition"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
