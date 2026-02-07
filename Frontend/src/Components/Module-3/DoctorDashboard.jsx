import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, ClipboardList, Loader2, Activity, MessageSquare, Eye } from "lucide-react";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:5000";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);

  const fetchData = useCallback(async (isInitial = false) => {
    try {
      const res = await fetch(`${API_BASE}/doctor/consultations`, { 
        credentials: "include" 
      });
      
      if (res.status === 401) return navigate("/login");
      
      const data = await res.json();
      setConsultations(data);

      if (isInitial) {
        const profileRes = await fetch(`${API_BASE}/doctor/profile`, { 
          credentials: "include" 
        });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          // Ensure this matches your specific DB column
          setIsAvailable(profileData.is_available_online || profileData.available); 
        }
      }
    } catch (err) {
      console.error("Critical Sync Failure:", err);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(() => fetchData(false), 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const stats = useMemo(() => ({
    pending: consultations.filter(c => c.status === 'pending').length,
    accepted: consultations.filter(c => c.status === 'accepted').length,
    completed: consultations.filter(c => c.status === 'completed').length
  }), [consultations]);

  const toggleAvailability = async () => {
    try {
      const newStatus = !isAvailable;
      const res = await fetch(`${API_BASE}/doctor/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: newStatus }), // Check if your backend expects 'available' or 'is_available_online'
        credentials: "include"
      });

      if (res.ok) {
        setIsAvailable(newStatus);
        toast.success(`SYSTEM: ${newStatus ? 'ONLINE' : 'OFFLINE'}`);
      }
    } catch (err) {
      toast.error("DB Update Failure");
    }
  };

  const handleAction = async (id, action) => {
    try {
      const res = await fetch(`${API_BASE}/otochat/respond/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
        credentials: "include"
      });

      if (res.ok) {
        const data = await res.json();
        setConsultations(prev => prev.map(c => c.id === id ? { ...c, status: data.status } : c));
        toast.success(`SESSION ${id}: ${action.toUpperCase()}`);
        
        if (action === 'accepted') {
          navigate("/doctordashboard/onetoonechat", { state: { consultationId: id } });
        }
      }
    } catch (err) {
      toast.error("Protocol Execution Failure");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen text-emerald-600 bg-slate-50 font-mono">
      <Loader2 className="animate-spin mb-4" size={48} />
      <span className="font-black text-[10px] tracking-[0.4em] uppercase text-emerald-800">Neural Sync in Progress...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 px-8 pt-24 pb-12 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">Clinical Command</h1>
            <div className="mt-3 flex items-center gap-3">
              <span className={`h-2 w-2 rounded-full ${isAvailable ? 'bg-emerald-500 animate-ping' : 'bg-slate-300'}`}></span>
              <p className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase">Real-Time Queue Monitoring</p>
            </div>
          </div>
          
          <button 
            onClick={toggleAvailability}
            className={`px-10 py-4 font-black text-[11px] tracking-[0.2em] transition-all border-2 ${
              isAvailable 
              ? "bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-100" 
              : "bg-white border-slate-300 text-slate-400"
            }`}
          >
            {isAvailable ? "PROTOCOL: ACTIVE" : "PROTOCOL: STANDBY"}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <StatCard title="Awaiting Triage" value={stats.pending} color="yellow" />
          <StatCard title="Active In-Session" value={stats.accepted} color="green" />
          <StatCard title="Archive/Closed" value={stats.completed} color="slate" />
        </div>

        {/* Queue Table */}
        <div className="bg-white border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-3 text-slate-800">
              <ClipboardList size={18} />
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">Patient Assessment Queue</h3>
            </div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Refresh Interval: 5.0s</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/30">
                  <th className="p-6">Index</th>
                  <th className="p-6">Patient Identifier</th>
                  <th className="p-6">Severity</th>
                  <th className="p-6 text-right">Operational Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {consultations.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-20 text-center text-slate-300 text-[10px] font-black uppercase tracking-[0.3em]">No active subjects in queue.</td>
                  </tr>
                ) : (
                  consultations.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-6 font-mono text-xs font-bold text-slate-400">#{c.id}</td>
                      <td className="p-6">
                        <span className="block font-black text-slate-800 text-sm uppercase tracking-tight">{c.patient_name}</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Status: {c.status}</span>
                      </td>
                      <td className="p-6">
                        <span className={`px-4 py-1 text-[9px] font-black tracking-widest uppercase border-2 ${
                          c.triage_result === 'RED' ? 'border-red-500 text-red-600 bg-red-50 animate-pulse' : 'border-emerald-500 text-emerald-600 bg-emerald-50'
                        }`}>
                          {c.triage_result || 'NORMAL'}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex justify-end gap-3">
                          {/* Always allow viewing the SOAP record if it exists */}
                          <button 
                            onClick={() => navigate(`/doctordashboard/view/${c.id}`)}
                            className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"
                            title="View Records"
                          >
                            <Eye size={18} />
                          </button>

                          {c.status === 'pending' && (
                            <>
                              <button onClick={() => handleAction(c.id, 'accepted')} className="px-4 py-2 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase hover:bg-emerald-600 hover:text-white transition-all">
                                Accept
                              </button>
                              <button onClick={() => handleAction(c.id, 'rejected')} className="px-4 py-2 bg-red-100 text-red-700 text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all">
                                Deny
                              </button>
                            </>
                          )}
                          
                          {c.status === 'accepted' && (
                            <button 
                              onClick={() => navigate("/doctordashboard/onetoonechat", { state: { consultationId: c.id } })}
                              className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase hover:shadow-lg hover:shadow-emerald-100 transition-all"
                            >
                              <MessageSquare size={14} /> Resume Session
                            </button>
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
  const colors = {
    green: "border-b-emerald-500",
    yellow: "border-b-yellow-500",
    slate: "border-b-slate-400"
  };
  return (
    <div className={`p-10 bg-white border border-slate-200 shadow-sm border-b-8 ${colors[color]}`}>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4">{title}</p>
      <h2 className="text-6xl font-black text-slate-900 tracking-tighter italic">{String(value).padStart(2, '0')}</h2>
    </div>
  );
};