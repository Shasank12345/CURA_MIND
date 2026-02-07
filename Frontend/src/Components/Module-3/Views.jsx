import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText, User, ShieldAlert, Loader2, Activity, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

const ViewConsultation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchClinicalData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/doctor/consultation/${id}`, { 
          credentials: 'include' 
        });
        
        if (res.status === 401) return navigate("/login");
        if (!res.ok) throw new Error("Consultation record not found or unauthorized.");
        
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Clinical Fetch Error:", err);
        setError(true);
        toast.error("DATA ACCESS FAILURE: RECORD NOT FOUND");
      }
    };

    if (id) fetchClinicalData();
  }, [id, navigate]);

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 font-mono">
      <ShieldAlert className="text-red-500 mb-4" size={48} />
      <p className="text-red-600 font-black uppercase tracking-widest text-xs">Access Denied: Record Missing</p>
      <button 
        onClick={() => navigate('/doctordashboard')} 
        className="mt-6 px-8 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all"
      >
        Return to Command
      </button>
    </div>
  );

  if (!data) return (
    <div className="flex flex-col items-center justify-center min-h-screen text-emerald-600 bg-slate-50 font-mono">
      <Loader2 className="animate-spin mb-4" size={32} />
      <span className="text-[10px] font-black tracking-[0.4em] uppercase">Decrypting Clinical Data...</span>
    </div>
  );

  return (
    <div className="p-8 bg-slate-50 min-h-screen pt-24 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* TOP NAV */}
        <button 
          onClick={() => navigate(-1)} 
          className="mb-10 flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-colors font-black text-[10px] uppercase tracking-widest group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Clinical Queue
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* PATIENT INFO SIDEBAR */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-none border border-slate-200 shadow-sm border-t-4 border-t-emerald-500">
              <div className="flex items-center gap-2 mb-8 text-slate-400">
                <User size={16} />
                <h2 className="text-[10px] uppercase font-black tracking-[0.2em]">Clinical Subject</h2>
              </div>
              
              <h1 className="text-3xl font-black text-slate-900 leading-none tracking-tighter uppercase mb-2">
                {data.patient_name}
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Verified Patient Record</p>
              
              <div className="space-y-6 pt-6 border-t border-slate-100">
                <div>
                  <span className="block text-[9px] text-slate-400 font-black uppercase tracking-widest mb-2">Triage Level</span>
                  <span className={`inline-block px-4 py-1 text-[10px] font-black border-2 ${
                    data.triage_result === 'RED' 
                      ? 'border-red-500 text-red-600 bg-red-50 animate-pulse' 
                      : 'border-emerald-500 text-emerald-600 bg-emerald-50'
                  }`}>
                    {data.triage_result || 'NORMAL'}
                  </span>
                </div>

                <div>
                  <span className="block text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Session Reference</span>
                  <span className="font-mono text-slate-900 font-bold text-xs">#{id}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-500">
                  <Clock size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-tight">Record Fetched: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-none text-white shadow-xl shadow-slate-200">
              <div className="flex items-center gap-2 mb-4 text-emerald-400">
                <ShieldAlert size={18} />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Protocol Notice</h3>
              </div>
              <p className="text-[11px] leading-relaxed font-bold uppercase tracking-tight opacity-70">
                Data generated via AI-assisted triage. Verify all objective metrics before authorizing treatment plan.
              </p>
            </div>
          </aside>

          {/* SOAP CONTENT AREA */}
          <main className="lg:col-span-3 space-y-6">
            <header className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Activity className="text-emerald-600" size={24} />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Electronic Health Record</h3>
              </div>
              <div className="h-[1px] flex-grow mx-6 bg-slate-200 hidden md:block"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">SOAP Framework v1.0</span>
            </header>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Optional chaining ?. ensures no crashes on missing segments */}
              <SoapCard 
                label="Subjective" 
                title="Symptom Narrative" 
                subtitle="Patient self-reported history & complaints"
                content={data.soap?.s} 
              />
              <SoapCard 
                label="Objective" 
                title="Clinical Observations" 
                subtitle="Vital signs, physical findings & triage data"
                content={data.soap?.o} 
              />
              <SoapCard 
                label="Assessment" 
                title="Diagnostic Logic" 
                subtitle="Differential diagnosis and severity assessment"
                content={data.soap?.a} 
              />
              <SoapCard 
                label="Plan" 
                title="Proposed Intervention" 
                subtitle="Medication, referrals, and follow-up instructions"
                content={data.soap?.p} 
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

const SoapCard = ({ label, title, subtitle, content }) => (
  <section className="bg-white p-0 rounded-none border border-slate-200 shadow-sm group hover:border-emerald-500 transition-colors">
    <div className="flex flex-col md:flex-row">
      <div className="md:w-64 bg-slate-50 p-8 border-b md:border-b-0 md:border-r border-slate-100">
        <span className="block text-emerald-600 font-black text-xs uppercase tracking-[0.3em] mb-2">{label}</span>
        <h4 className="text-[11px] text-slate-900 font-black uppercase tracking-widest leading-tight">{title}</h4>
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight mt-4 leading-relaxed">{subtitle}</p>
      </div>
      <div className="flex-grow p-8 bg-white">
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-700 leading-relaxed font-bold text-sm whitespace-pre-wrap italic">
            {content || "NO CLINICAL DATA RECORDED FOR THIS SEGMENT."}
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default ViewConsultation;