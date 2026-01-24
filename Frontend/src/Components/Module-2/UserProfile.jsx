import { useState, useEffect } from "react";
import { 
  Calendar, Phone, MapPin, Mail, ShieldCheck, 
  Pencil, Loader2, AlertCircle 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/user/profile", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include" // REQUIRED for session access
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else if (res.status === 401) {
          navigate("/login");
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
        toast.error("Connection to medical server failed");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-emerald-600" size={40} />
    </div>
  );

  if (error || !user) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <AlertCircle className="text-red-500 mb-4" size={48} />
      <h2 className="text-xl font-bold">Profile Unreachable</h2>
      <button onClick={() => window.location.reload()} className="mt-4 text-emerald-600 font-bold">Try Again</button>
    </div>
  );

  const initials = user.full_name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f7f7] to-white p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* HEADER CARD */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm relative flex flex-col md:flex-row items-center gap-8">
          <button
            onClick={() => navigate("/userpannel/profileedit")}
            className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 text-xs font-black bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition"
          >
            <Pencil size={14} /> EDIT PROFILE
          </button>

          <div className="w-32 h-32 rounded-full bg-emerald-100 flex items-center justify-center border-4 border-white shadow-inner">
            <span className="text-emerald-700 text-4xl font-black">{initials}</span>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{user.full_name}</h1>
              <span className="px-3 py-1 text-[10px] font-black bg-emerald-100 text-emerald-700 rounded-full uppercase">
                {user.role}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow icon={<Mail size={16} />} label="Email" value={user.email} />
              <InfoRow icon={<Phone size={16} />} label="Phone" value={user.phone} />
              <InfoRow icon={<MapPin size={16} />} label="Location" value={user.address || "No address set"} />
              <InfoRow icon={<ShieldCheck size={16} />} label="Security" value="Verified Account" />
            </div>
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h3 className="text-sm font-black text-slate-400 uppercase mb-6 tracking-widest">Medical Context</h3>
            <div className="space-y-4">
              <DetailField label="Account ID" value={`#USR-${user.full_name.slice(0, 3).toUpperCase()}`} />
              <DetailField label="Primary Language" value="English / Nepali" />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h3 className="text-sm font-black text-slate-400 uppercase mb-6 tracking-widest">System Status</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Your profile is currently active. All triage sessions linked to <strong>{user.email}</strong> are visible in your history tab.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* HELPER COMPONENTS */
function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 text-slate-600">
      <span className="text-emerald-600">{icon}</span>
      <span className="text-sm font-medium"><span className="text-slate-400 mr-1">{label}:</span> {value}</span>
    </div>
  );
}

function DetailField({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
      <span className="text-xs font-bold text-slate-400 uppercase">{label}</span>
      <span className="text-sm font-bold text-slate-800">{value}</span>
    </div>
  );
}