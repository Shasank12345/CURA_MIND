import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import RejectOption from './Rejectoption'; 

export default function DoctorRespond2() {
  const { state: entry } = useLocation();
  const [showReject, setShowReject] = useState(false);

  return (
    <div className="relative min-h-screen bg-gray-100 flex items-center justify-center p-4">

    
      <div className={`${showReject ? 'filter blur-sm pointer-events-none' : ''} w-full max-w-md bg-white rounded-xl shadow-lg p-8 transition`}>
        <h2 className="text-2xl font-bold text-center mb-2">
         Doctor Request
        </h2>

        <div className="mb-4">
          <label className="block font-medium mb-1">Full Name</label>
          <input type="text" value={entry?.name || entry?.fullname || ''} readOnly className="w-full border rounded-lg px-4 py-2" />
        </div>

       
        <div className="mb-4">
          <label className="block font-medium mb-1">Email</label>
          <input type="email" value={entry?.email || ''} readOnly className="w-full border rounded-lg px-4 py-2" />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Phone Number</label>
          <input type="text" value={entry?.phone_num || entry?.phonenumber || ''} readOnly className="w-full border rounded-lg px-4 py-2" />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Area of Specialization</label>
          <input type="text" value={entry?.specification || ''} readOnly className="w-full border rounded-lg px-4 py-2" />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Doctor License Number</label>
          <input type="text" value={entry?.licenseNo || ''} readOnly className="w-full border rounded-lg px-4 py-2" />
        </div>

        <div className="mb-6">
          <label className="block font-medium mb-2">License Image</label>
          {entry?.licenseImage ? (
            <img src={entry.licenseImage} alt="Doctor License" className="w-full h-48 object-contain border rounded-lg bg-gray-50" />
          ) : (
            <div className="w-full h-48 flex items-center justify-center border rounded-lg bg-gray-50 text-gray-400">
              No license image uploaded
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button onClick={() => alert('Accepted')} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Accept
          </button>
          <button onClick={() => setShowReject(true)} className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">
            Reject
          </button>
        </div>
      </div>


      {showReject && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-sm relative">
            <button
              onClick={() => setShowReject(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <RejectOption />
          </div>
        </div>
      )}
    </div>
  );
}
