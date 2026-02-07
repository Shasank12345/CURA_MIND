import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  Calendar,
  FileText,
  ToggleLeft,
  ToggleRight,
  Loader2,
  MapPin,
  ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:5000";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/doctor/profile`, {
      method: "GET",
      credentials: "include",
      headers: { "Accept": "application/json" }
    })
      .then((res) => {
        if (res.status === 401) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Profile Fetch Error:", err);
        toast.error("Session expired. Please login.");
        navigate("/Login");
      });
  }, [navigate]);

  const handleStatusToggle = async () => {
    if (!user) return;
    const newStatus = !user.available;
    try {
      const res = await fetch(`${API_BASE}/doctor/update`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: newStatus }),
      });

      if (res.ok) {
        const result = await res.json();
        setUser(prev => ({ ...prev, available: result.available }));
        toast.success(`Status: ${result.available ? "Online" : "Offline"}`);
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <Loader2 className="animate-spin text-green-600" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-28 px-6 pb-12">
      <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-green-900/5 overflow-hidden border border-gray-100">
        
        {/* Banner Section */}
        <div className="bg-green-600 h-32 relative">
          <div className="absolute -bottom-16 left-10 flex items-end gap-6">
            <div className="relative">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name)}&background=16a34a&color=fff&size=128`}
                alt="Profile"
                className="w-32 h-32 rounded-3xl border-4 border-white shadow-xl object-cover bg-white"
              />
              <div className={`absolute bottom-1 right-1 w-7 h-7 rounded-full border-4 border-white ${user?.available ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            </div>
            <div className="pb-2">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">{user?.full_name}</h2>
              <div className="flex items-center gap-2 text-green-600">
                <ShieldCheck size={16} />
                <p className="font-bold tracking-widest text-[10px] uppercase">{user?.specialization}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="pt-24 p-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column */}
          <div className="lg:col-span-8">
            
            {/* Availability Toggle Card */}
            <div className="bg-green-50/50 p-6 rounded-[2rem] mb-10 flex items-center justify-between border border-green-100">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${user?.available ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {user?.available ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                </div>
                <div>
                  <p className="text-[10px] font-black text-green-800/40 uppercase tracking-widest">Consultation Status</p>
                  <p className={`text-lg font-black ${user?.available ? 'text-green-700' : 'text-slate-400'}`}>
                    {user?.available ? 'ACTIVE & ACCEPTING PATIENTS' : 'CURRENTLY OFFLINE'}
                  </p>
                </div>
              </div>
              <button onClick={handleStatusToggle} className="transition-transform active:scale-90">
                {user?.available ? (
                  <ToggleRight size={54} className="text-green-600 fill-green-200 cursor-pointer" />
                ) : (
                  <ToggleLeft size={54} className="text-gray-300 cursor-pointer" />
                )}
              </button>
            </div>

            {/* Info Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem icon={<Mail size={20}/>} label="Official Email" value={user?.email} />
              <InfoItem icon={<Phone size={20}/>} label="Phone Number" value={user?.phone} />
              <InfoItem icon={<MapPin size={20}/>} label="Hospital" value={user?.hospital} />
              <InfoItem icon={<Calendar size={20}/>} label="Date of Birth" value={user?.dob} />
            </div>

            {/* Bio Section */}
            <div className="mt-8 p-8 rounded-[2rem] bg-slate-50 border border-slate-100">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Professional Bio</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                {user?.bio || "No professional summary has been added yet. Update your profile to help patients learn more about your expertise."}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4">
            <div className="sticky top-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-widest">Medical License</h3>
                <span className="bg-green-100 text-green-700 text-[9px] font-black px-3 py-1 rounded-full uppercase">Verified</span>
              </div>
              
              <div className="rounded-[2.5rem] overflow-hidden border-2 border-dashed border-gray-200 aspect-[3/4] flex items-center justify-center bg-gray-50 relative group transition-all hover:border-green-300 shadow-inner">
                {user?.license_img ? (
                  <>
                    <img 
                      src={user.license_img} 
                      alt="License" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </>
                ) : (
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                      <FileText size={32} className="text-gray-200" />
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Document Missing</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="bg-slate-100 p-2 rounded-lg text-slate-400">
                  <FileText size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">License ID</p>
                  <p className="text-xs font-mono font-bold text-slate-700">{user?.license_no || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 p-5 rounded-3xl border border-gray-50 bg-white hover:bg-green-50/20 transition-all group">
      <div className="text-green-600 bg-green-50 p-3 rounded-2xl group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-sm font-bold text-slate-700">{value || "Not provided"}</p>
      </div>
    </div>
  );
}
