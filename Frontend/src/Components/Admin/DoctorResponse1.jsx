import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function DoctorResponse1() {
  const navigate = useNavigate();
  const [doctorData, setDoctorData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/admin/get_doctors/unverified', { withCredentials: true })
      .then(res => {
        setDoctorData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Queue error", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center p-10 font-bold">Fetching pending requests...</div>;

  return (
    <div className="p-4 pt-[60px] bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-black mb-8 text-center text-indigo-900">PENDING VERIFICATIONS</h2>
      
      {doctorData.length === 0 ? (
        <div className="text-center text-gray-500 italic">No pending applications found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center max-w-7xl mx-auto">
          {doctorData.map((doctor) => (
            <div 
              key={doctor.id} 
              className="relative group border border-gray-200 p-6 shadow-sm hover:shadow-xl rounded-2xl w-full bg-white transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-100 p-2 rounded-full text-indigo-600">
                  <span className="text-xl">👨‍⚕️</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 truncate">{doctor.name}</h3>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Credentials</p>
                <p className="text-sm truncate"><strong>Email:</strong> {doctor.email}</p>
                <p className="text-sm"><strong>License:</strong> <span className="font-mono text-indigo-600">{doctor.licenseNo}</span></p>
                <p className="text-sm"><strong>Specialty:</strong> {doctor.specialization || doctor.specification}</p>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-indigo-900/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                <button 
                  onClick={() => navigate('/adminpannel/doctorresponse2', { state: { doctor } })} 
                  className="bg-indigo-600 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition"
                >
                  Review Application
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}