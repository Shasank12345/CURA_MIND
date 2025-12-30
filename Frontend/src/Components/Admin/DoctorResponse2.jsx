import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import RejectOption from './Rejectoption'; 

export default function DoctorResponSE2() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showReject, setShowReject] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const doctor = state?.doctor;

  if (!doctor) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 font-bold bg-red-50 p-4 rounded-xl border border-red-200">
          Error: No doctor data found. Please return to the previous page.
        </div>
      </div>
    );
  }

  // Helper to handle both Supabase cloud URLs and local filenames
  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith('http')) return img;
    return `http://localhost:5000/static/uploads/${img}`;
  };

  const handleAccept = async () => {
    setIsProcessing(true);
    try {
      const res = await axios.post(`http://localhost:5000/admin/handle_request/${doctor.id}`, 
        { action: 'verify' }, 
        { withCredentials: true }
      );
      
      if (res.status === 200) {
        toast.success("Doctor verified and email sent!");
        navigate('/adminpannel/doctorresponse1');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to verify doctor");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinished = () => {
    setShowReject(false);
    navigate('/adminpannel/doctorresponse1'); 
  };

  return (
    <div className="relative min-h-screen bg-gray-50 flex items-center justify-center p-6">
      {/* Main Content Card */}
      <div className={`bg-white shadow-2xl rounded-3xl p-8 max-w-2xl w-full transition-all duration-300 ${showReject ? 'filter blur-md pointer-events-none scale-95' : 'scale-100'}`}>
        <h2 className="text-3xl font-black text-indigo-900 mb-6 text-center border-b pb-4">Verification Review</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
              <p className="text-lg font-bold text-gray-800">{doctor.name}</p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Specialization</label>
              <p className="text-gray-700">{doctor.specialization || doctor.specification}</p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">License Number</label>
              <p className="font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded inline-block">
                {doctor.licenseNo}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <label className="text-xs font-bold text-gray-400 uppercase mb-3">License Document</label>
            {doctor.licenseImage ? (
              <a 
                href={getImageUrl(doctor.licenseImage)} 
                target="_blank" 
                rel="noreferrer"
                className="group relative block overflow-hidden rounded-lg shadow-sm"
              >
                <img 
                  src={getImageUrl(doctor.licenseImage)} 
                  alt="License" 
                  className="h-40 w-40 object-cover rounded-lg border-2 border-dashed border-gray-300 group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Image+Not+Found"; }}
                />
                <div className="absolute inset-0 bg-indigo-900/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-indigo-700 shadow-lg">View Full</span>
                </div>
              </a>
            ) : (
              <div className="h-40 w-40 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                <p className="text-gray-400 text-xs italic">No image provided</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={handleAccept} 
            disabled={isProcessing}
            className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-bold hover:bg-green-700 transition transform active:scale-95 disabled:bg-gray-400 disabled:transform-none"
          >
            {isProcessing ? "Processing..." : "Verify & Approve"}
          </button>
          
          <button 
            onClick={() => setShowReject(true)} 
            disabled={isProcessing}
            className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-bold hover:bg-red-600 transition transform active:scale-95 disabled:bg-gray-400 disabled:transform-none"
          >
            Reject Application
          </button>
        </div>
      </div>

      {/* Rejection Modal Overlay */}
      {showReject && (
        <div className="fixed inset-0 bg-indigo-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform animate-in zoom-in-95 duration-300">
            <RejectOption 
              doctorId={doctor.id} 
              onComplete={handleFinished} 
              onCancel={() => setShowReject(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}