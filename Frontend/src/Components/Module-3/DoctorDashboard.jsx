import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, CheckCircle, XCircle, ClipboardList, Loader2, Activity } from "lucide-react";
import { toast } from "react-toastify";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Consultations
        const res = await fetch("http://localhost:5000/doctor/consultations", { 
          credentials: "include" 
        });
        if (res.status === 401) return navigate("/login");
        const data = await res.json();
        setConsultations(data);

        // 2. Fetch Profile to get current 'is_available_online' status
        const profileRes = await fetch("http://localhost:5000/doctor/profile", { 
          credentials: "include" 
        });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setIsAvailable(profileData.available); 
        }
      } catch (err) {
        toast.error("Failed to sync with clinical server.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const stats = useMemo(() => ({
    pending: consultations.filter(c => c.status === 'pending').length,
    accepted: consultations.filter(c => c.status === 'accepted').length,
    rejected: consultations.filter(c => c.status === 'rejected').length
  }), [consultations]);

  const toggleAvailability = async () => {
    try {
      const newStatus = !isAvailable;
      // Fixed: Pointed to /update and used PUT to match backend
      const res = await fetch("http://localhost:5000/doctor/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: newStatus }),
        credentials: "include"
      });

      if (res.ok) {
        setIsAvailable(newStatus);
        toast.success(`Availability: ${newStatus ? 'Online' : 'Offline'}`);
      } else {
        toast.error("Failed to update status.");
      }
    } catch (err) {
      toast.error("Network error updating availability.");
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
        toast.success(`Session ${status}`);
      }
    } catch (err) {
      toast.error("Error updating consultation status.");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen text-emerald-600">
      <Loader2 className="animate-spin mb-2" size={48} />
      <span className="font-bold text-xs tracking-widest uppercase">Initializing Portal...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 px-6 pt-20 pb-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Doctor Portal</h1>
          <p className="text-slate-500 text-sm font-medium italic">Internal Clinical Interface</p>
        </div>
        
        <button 
          onClick={toggleAvailability}
          className={`flex items-center gap-2 px-6 py-2 rounded-full font-black text-[10px] tracking-widest transition-all border-2 ${
            isAvailable 
            ? "bg-emerald-50 border-emerald-600 text-emerald-600 shadow-[0_0_15px_-5px_rgba(5,150,105,0.4)]" 
            : "bg-white border-slate-300 text-slate-400"
          }`}
        >
          <Activity size={14} className={isAvailable ? "animate-pulse" : ""} />
          {isAvailable ? "SYSTEM ONLINE" : "SYSTEM OFFLINE"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard title="Pending" value={stats.pending} color="yellow" />
        <StatCard title="Accepted" value={stats.accepted} color="green" />
        <StatCard title="Rejected" value={stats.rejected} color="red" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <ClipboardList className="text-emerald-600" size={20} />
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Clinical Queue</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-400 uppercase text-[9px] font-black tracking-widest">
              <tr>
                <th className="p-4 text-center">Ref</th>
                <th className="p-4">Patient</th>
                <th className="p-4">Triage Priority</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {consultations.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-slate-400 font-medium italic">
                    No active consultations in queue.
                  </td>
                </tr>
              ) : (
                consultations.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-center font-mono font-bold text-slate-400">#{c.id}</td>
                    <td className="p-4 font-bold text-slate-700">{c.patient_name}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-sm text-[10px] font-black ${
                        c.triage_result === 'RED' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {c.triage_result}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/doctordashboard/views/${c.id}`)}
                          className="p-2 bg-slate-100 text-slate-600 rounded hover:bg-slate-800 hover:text-white transition-all"
                        >
                          <Eye size={16} />
                        </button>
                        
                        {c.status === 'pending' ? (
                          <>
                            <button 
                              onClick={() => handleAction(c.id, 'accepted')} 
                              className="p-2 bg-emerald-100 text-emerald-600 rounded hover:bg-emerald-600 hover:text-white"
                            >
                              <CheckCircle size={16}/>
                            </button>
                            <button 
                              onClick={() => handleAction(c.id, 'rejected')} 
                              className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-600 hover:text-white"
                            >
                              <XCircle size={16}/>
                            </button>
                          </>
                        ) : (
                          <span className={`text-[9px] font-black uppercase py-1 px-2 rounded-sm border ${
                            c.status === 'accepted' ? 'border-emerald-200 text-emerald-500' : 'border-red-200 text-red-400'
                          }`}>
                            {c.status}
                          </span>
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
  );
}

const StatCard = ({ title, value, color }) => {
  const styles = {
    green: "bg-white border-l-4 border-l-emerald-500 text-emerald-700",
    red: "bg-white border-l-4 border-l-red-500 text-red-700",
    yellow: "bg-white border-l-4 border-l-yellow-500 text-yellow-700",
  };
  return (
    <div className={`p-6 border border-slate-200 shadow-sm ${styles[color]}`}>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{title}</p>
      <h2 className="text-4xl font-black text-slate-800 tracking-tighter">{value}</h2>
    </div>
  );
};