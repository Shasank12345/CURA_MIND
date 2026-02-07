import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, CheckCircle, XCircle, ClipboardList, Loader2, Activity, MessageSquare } from "lucide-react";
import { toast } from "react-toastify";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);

  // Memoized fetch to prevent unnecessary re-renders during polling
  const fetchData = useCallback(async (isInitial = false) => {
    try {
      const res = await fetch("http://localhost:5000/doctor/consultations", { 
        credentials: "include" 
      });
      
      if (res.status === 401) return navigate("/login");
      
      const data = await res.json();
      setConsultations(data);

      if (isInitial) {
        const profileRes = await fetch("http://localhost:5000/doctor/profile", { 
          credentials: "include" 
        });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setIsAvailable(profileData.available); 
        }
      }
    } catch (err) {
      console.error("Sync error:", err);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [navigate]);

  // Initial Load + Polling Every 5 Seconds
  useEffect(() => {
    fetchData(true);
    const interval = setInterval(() => fetchData(false), 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const stats = useMemo(() => ({
    pending: consultations.filter(c => c.status === 'pending').length,
    accepted: consultations.filter(c => c.status === 'accepted').length,
    rejected: consultations.filter(c => c.status === 'rejected').length
  }), [consultations]);

  const toggleAvailability = async () => {
    try {
      const newStatus = !isAvailable;
      const res = await fetch("http://localhost:5000/doctor/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: newStatus }),
        credentials: "include"
      });

      if (res.ok) {
        setIsAvailable(newStatus);
        toast.success(`SYSTEM: ${newStatus ? 'ONLINE' : 'OFFLINE'}`);
      }
    } catch (err) {
      toast.error("Network error updating status.");
    }
  };

  const handleAction = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/doctor/consultation/${id}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include"
      });
      if (res.ok) {
        setConsultations(prev => prev.map(c => c.id === id ? { ...c, status } : c));
        toast.success(`ID #${id} ${status.toUpperCase()}`);
      }
    } catch (err) {
      toast.error("Action failed.");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen text-emerald-600 bg-slate-50">
      <Loader2 className="animate-spin mb-2" size={48} />
      <span className="font-black text-[10px] tracking-[0.3em] uppercase">Synchronizing Neural Link...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 px-6 pt-24 pb-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Clinical Command</h1>
            <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mt-1 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
              Live Session Monitoring
            </p>
          </div>
          
          <button 
            onClick={toggleAvailability}
            className={`flex items-center gap-3 px-8 py-3 rounded-none font-black text-[11px] tracking-[0.2em] transition-all border-2 ${
              isAvailable 
              ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200" 
              : "bg-white border-slate-300 text-slate-400"
            }`}
          >
            <Activity size={16} className={isAvailable ? "animate-pulse" : ""} />
            {isAvailable ? "STATUS: ACTIVE" : "STATUS: INACTIVE"}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Awaiting Triage" value={stats.pending} color="yellow" />
          <StatCard title="Active Sessions" value={stats.accepted} color="green" />
          <StatCard title="Terminated" value={stats.rejected} color="red" />
        </div>

        {/* Queue Table */}
        <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-3">
              <ClipboardList className="text-slate-800" size={18} />
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.15em]">Patient Queue</h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Auto-refreshing every 5s</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/30">
                  <th className="p-5">ID</th>
                  <th className="p-5">Patient Name</th>
                  <th className="p-5">Priority</th>
                  <th className="p-5 text-right">Operational Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {consultations.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-16 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                      Queue Empty. No incoming data.
                    </td>
                  </tr>
                ) : (
                  consultations.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-all group">
                      <td className="p-5 font-mono text-xs font-bold text-slate-400">#{c.id}</td>
                      <td className="p-5">
                        <span className="block font-black text-slate-800 text-sm uppercase tracking-tight">{c.patient_name}</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase">Ref: {c.patient_id || 'EXT-00'}</span>
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1 text-[9px] font-black tracking-widest uppercase border ${
                          c.triage_result === 'RED' ? 'border-red-500 text-red-600 bg-red-50' : 'border-emerald-500 text-emerald-600 bg-emerald-50'
                        }`}>
                          {c.triage_result}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex justify-end gap-3">
                          <button 
                            onClick={() => navigate(`/doctordashboard/views/${c.id}`)}
                            className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-600 text-[10px] font-black uppercase hover:bg-slate-900 hover:text-white transition-all"
                          >
                            <Eye size={14} /> View
                          </button>
                          
                          {c.status === 'pending' ? (
                            <>
                              <button 
                                onClick={() => handleAction(c.id, 'accepted')} 
                                className="flex items-center gap-2 px-3 py-2 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase hover:bg-emerald-600 hover:text-white transition-all"
                              >
                                <CheckCircle size={14}/> Accept
                              </button>
                              <button 
                                onClick={() => handleAction(c.id, 'rejected')} 
                                className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all"
                              >
                                <XCircle size={14}/> Deny
                              </button>
                            </>
                          ) : c.status === 'accepted' ? (
                            <button 
                              onClick={() => navigate("/doctordashboard/onetoonechat", { state: { consultationId: c.id } })}
                              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase shadow-md shadow-emerald-100 hover:scale-105 transition-all"
                            >
                              <MessageSquare size={14} /> Start Chat
                            </button>
                          ) : (
                            <span className="text-[10px] font-black uppercase text-slate-300 py-2">{c.status}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, color }) => {
  const styles = {
    green: "border-b-4 border-b-emerald-500",
    red: "border-b-4 border-b-red-500",
    yellow: "border-b-4 border-b-yellow-500",
  };
  return (
    <div className={`p-8 bg-white border border-slate-200 shadow-sm transition-all hover:shadow-md ${styles[color]}`}>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">{title}</p>
      <h2 className="text-5xl font-black text-slate-900 tracking-tighter">{String(value).padStart(2, '0')}</h2>
    </div>
  );
};