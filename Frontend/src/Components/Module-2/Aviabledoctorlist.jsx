import { useState, useEffect } from "react";
import { Phone, User, MessageCircle, Hospital, Award, Info, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const API_BASE = "http://127.0.0.1:5000";

export default function AvailableDoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState(null); // Track which doctor is being pinged
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const specialtyFilter = queryParams.get("specialty");
  const triageId = queryParams.get("triage_id");

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const url = specialtyFilter 
          ? `${API_BASE}/doctor/available?specialty=${specialtyFilter}`
          : `${API_BASE}/doctor/available`;

        const res = await fetch(url);
        const data = await res.json();
        
        if (res.ok) {
          setDoctors(data);
        } else {
          toast.error(data.error || "Failed to load doctors");
        }
      } catch (err) {
        toast.error("Server connection failed");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [specialtyFilter]);

  // NEW: Logical Handler for the Consultation Handshake
  const handleConsultClick = async (doctorId) => {
    if (!triageId) {
      toast.error("Triage session missing. Please restart assessment.");
      return;
    }

    setRequestingId(doctorId);

    try {
      const res = await fetch(`${API_BASE}/user/consultation/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor_id: doctorId,
          triage_id: triageId
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Request sent! Waiting for doctor to review...");
        // Redirect to a waiting room where we poll for 'accepted' status
        navigate("/userpannel/waiting-room", { 
          state: { 
            consultationId: data.consultation_id,
            doctorId: doctorId 
          } 
        });
      } else {
        toast.error(data.error || "Request failed");
      }
    } catch (err) {
      toast.error("Network error. Could not reach server.");
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center px-4 pt-20 pb-10 font-sans">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-[2rem] shadow-xl p-8">
        
        {/* AI RECOMMENDATION BANNER */}
        {specialtyFilter && (
          <div className="mb-6 flex items-center gap-4 bg-emerald-50 border border-emerald-100 p-4 rounded-2xl animate-in slide-in-from-top duration-500">
            <div className="bg-emerald-600 p-2 rounded-lg text-white">
              <Info size={20} />
            </div>
            <div>
              <p className="text-xs font-black text-emerald-800 uppercase tracking-tight">AI Recommendation</p>
              <p className="text-sm text-emerald-700 font-medium">
                Based on your triage, we've found available <strong>{specialtyFilter}</strong> specialists for you.
              </p>
            </div>
          </div>
        )}

        <header className="mb-8 border-b border-slate-100 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {specialtyFilter ? `${specialtyFilter} Specialists` : "Available Doctors"}
            </h1>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-widest mt-1">
              Verified & Online Now
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold text-slate-700 uppercase">{doctors.length} Online</span>
          </div>
        </header>

        <div className="space-y-4">
          {loading ? (
            <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-tighter animate-pulse">
              Scanning Medical Directory...
            </div>
          ) : doctors.length > 0 ? (
            doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="group flex items-center justify-between p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-emerald-200 transition-all duration-300"
              >
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img
                      src={doctor.photo || `https://ui-avatars.com/api/?name=${doctor.name}&background=10b981&color=fff`}
                      className="w-16 h-16 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform"
                      alt={doctor.name}
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Dr. {doctor.name}</h3>
                    <div className="flex gap-4 mt-1">
                       <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                         <Award size={12} /> {doctor.specialization}
                       </span>
                       <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                         <Hospital size={12} /> {doctor.hospital || "Private Practice"}
                       </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(`/doctor-profile/${doctor.id}`)}
                    className="p-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                  >
                    <User size={22} />
                  </button>
                  
                  <button
                    onClick={() => handleConsultClick(doctor.id)}
                    disabled={requestingId !== null}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white text-sm font-black rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95 disabled:bg-slate-300 disabled:shadow-none"
                  >
                    {requestingId === doctor.id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <MessageCircle size={18} />
                    )}
                    {requestingId === doctor.id ? "SENDING..." : "CONSULT NOW"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center">
              <p className="text-slate-400 font-medium">No specialists matching this criteria are currently online.</p>
              <button onClick={() => navigate(-1)} className="mt-4 text-emerald-600 font-bold text-xs uppercase tracking-widest hover:underline">
                Return to Assessment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}