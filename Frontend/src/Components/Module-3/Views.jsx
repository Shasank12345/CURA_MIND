import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText, User, Activity, ShieldAlert } from 'lucide-react';

const ViewConsultation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/doctor/consultation/${id}`, { 
      credentials: 'include' 
    })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized or Not Found");
        return res.json();
      })
      .then(json => setData(json))
      .catch(() => setError(true));
  }, [id]);

  if (error) return (
    <div className="p-20 text-center">
      <p className="text-red-500 font-bold">Access Denied or Record Missing.</p>
      <button onClick={() => navigate('/doctor/dashboard')} className="mt-4 text-slate-600 underline">Return to Dashboard</button>
    </div>
  );

  if (!data) return (
    <div className="flex items-center justify-center min-h-screen text-emerald-600 font-black tracking-widest uppercase text-xs">
      Retrieving Clinical Data...
    </div>
  );

  return (
    <div className="p-8 bg-slate-50 min-h-screen pt-20">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-8 flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors font-bold text-xs uppercase tracking-widest"
      >
        <ChevronLeft size={16} /> Back to Clinical Queue
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* PATIENT SUMMARY SIDEBAR */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4 text-slate-400">
              <User size={18} />
              <h2 className="text-[10px] uppercase font-black tracking-[0.2em]">Patient Profile</h2>
            </div>
            <p className="text-2xl font-black text-slate-800 leading-tight">{data.patient_name}</p>
            <div className="mt-6 flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase">Priority</span>
                <span className={`px-3 py-1 rounded-sm font-black ${
                  data.triage_result === 'RED' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                }`}>
                  {data.triage_result}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase">Session ID</span>
                <span className="font-mono text-slate-800 font-bold">#{id}</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-900 p-6 rounded-2xl text-emerald-100 shadow-lg shadow-emerald-900/20">
            <div className="flex items-center gap-2 mb-2 opacity-60">
              <ShieldAlert size={16} />
              <h3 className="text-[10px] font-black uppercase tracking-widest">Clinical Protocol</h3>
            </div>
            <p className="text-xs leading-relaxed font-medium">
              Review all SOAP segments before approving prescriptions or referrals. Ensure data matches patient history.
            </p>
          </div>
        </div>

        {/* SOAP NOTES - MAIN CONTENT */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="text-emerald-600" size={20} />
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Electronic Health Record (SOAP)</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {/* Matches backend data structure: data.soap.s, .o, .a, .p */}
            <SoapSection title="S - Subjective" subtitle="Patient's stated symptoms & history" content={data.soap.s} />
            <SoapSection title="O - Objective" subtitle="Clinical observations & vitals" content={data.soap.o} />
            <SoapSection title="A - Assessment" subtitle="Diagnostic conclusions" content={data.soap.a} />
            <SoapSection title="P - Plan" subtitle="Proposed treatment & follow-up" content={data.soap.p} />
          </div>
        </div>
      </div>
    </div>
  );
};

const SoapSection = ({ title, subtitle, content }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-emerald-200 transition-all group">
    <div className="mb-4">
      <h3 className="text-emerald-600 font-black text-xs uppercase tracking-widest">{title}</h3>
      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">{subtitle}</p>
    </div>
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
      <p className="text-slate-700 leading-relaxed font-medium text-sm italic">
        {content || "No data provided for this segment."}
      </p>
    </div>
  </div>
);

export default ViewConsultation;