import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import RejectOption from './Rejectoption'; 

export default function DoctorResponse2() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showReject, setShowReject] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const doctor = state?.doctor;

  if (!doctor) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-red-500 font-bold bg-red-50 p-6 rounded-2xl border border-red-200 shadow-xl">
          ERROR: DATA CORRUPTED. RETURN TO DASHBOARD.
        </div>
      </div>
    );
  }

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
        toast.success("VERIFICATION SUCCESSFUL: DOCTOR NOTIFIED");
        navigate('/adminpannel/doctorresponse1');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "VERIFICATION FAILED");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className={`bg-white shadow-2xl rounded-[2.5rem] p-10 max-w-3xl w-full border border-gray-100 transition-all ${showReject ? 'blur-sm scale-95 opacity-50' : ''}`}>
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-black text-indigo-950 uppercase tracking-tighter">Review Credentials</h2>
          <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-3 py-1 rounded-full">PENDING_REVIEW</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Medical Practitioner</label>
              <p className="text-xl font-bold text-gray-900">{doctor.name}</p>
              <p className="text-sm text-gray-500">{doctor.email}</p>
            </div>
            
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Specialization</label>
              <p className="text-gray-800 font-semibold">{doctor.specialization}</p>
            </div>

            <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
              <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-1">Government License</label>
              <p className="font-mono text-indigo-700 font-bold text-lg">{doctor.licenseNo}</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Official Documentation</label>
             <div className="relative group overflow-hidden rounded-3xl border-4 border-gray-50 shadow-inner">
                <img 
                  src={getImageUrl(doctor.licenseImage)} 
                  alt="License" 
                  className="h-64 w-64 object-cover hover:scale-110 transition-transform duration-500 cursor-zoom-in"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=IMAGE+MISSING"; }}
                />
             </div>
          </div>
        </div>

        <div className="flex gap-4 mt-12">
          <button 
            onClick={handleAccept} 
            disabled={isProcessing}
            className="flex-1 bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 active:scale-95 disabled:bg-gray-300"
          >
            {isProcessing ? "TRANSMITTING..." : "Approve & Issue Credentials"}
          </button>
          
          <button 
            onClick={() => setShowReject(true)} 
            disabled={isProcessing}
            className="px-8 bg-gray-100 text-gray-400 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-50 hover:text-red-600 transition-all active:scale-95 disabled:opacity-0"
          >
            Reject
          </button>
        </div>
      </div>

      {showReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden">
            <RejectOption 
              doctorId={doctor.id} 
              onComplete={() => navigate('/adminpannel/doctorresponse1')} 
              onCancel={() => setShowReject(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}