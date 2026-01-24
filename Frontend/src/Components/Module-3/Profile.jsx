import { useEffect, useState } from "react";
import { Mail, Phone, Calendar, FileText, Pencil, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Real Data with Credentials
  useEffect(() => {
    fetch("http://localhost:5000/doctor/profile", {
      method: "GET",
      credentials: "include", // CRITICAL: This sends the session cookie
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
        console.error(err);
        toast.error("Session expired. Please login.");
        navigate("/Login");
      });
  }, [navigate]);

  // 2. Trigger Availability Toggle in Database
  const handleStatusToggle = async () => {
    const newStatus = !user.available;
    try {
      const res = await fetch("http://localhost:5000/doctor/update", {
        method: "PUT",
        credentials: "include", // CRITICAL: This sends the session cookie
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: newStatus }),
      });

      if (res.ok) {
        const result = await res.json();
        // Update local state based on DB response
        setUser({ ...user, available: result.available });
        toast.success(`Status updated to ${result.available ? "Online" : "Offline"}`);
      } else {
        toast.error("Update failed");
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
    <div className="min-h-screen bg-gray-50 pt-28 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-green-600 h-24 relative">
          <button 
            onClick={() => navigate("/doctordashboard/editprofile")}
            className="absolute top-6 right-8 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-green-700 px-5 py-2.5 rounded-xl shadow-lg text-sm font-bold hover:bg-white transition-all active:scale-95"
          >
            <Pencil size={16} /> Edit Profile
          </button>
        </div>

        {/* Content */}
        <div className="p-10 flex flex-col lg:flex-row gap-12">
          
          <div className="flex-1">
            <div className="flex items-start gap-6 mb-8">
              <div className="relative">
                <img
                  src={`https://ui-avatars.com/api/?name=${user.full_name}&background=16a34a&color=fff`}
                  alt="Profile"
                  className="w-32 h-32 rounded-3xl border-4 border-white shadow-2xl -mt-16 object-cover bg-white"
                />
                <div className={`absolute bottom-1 right-1 w-6 h-6 rounded-full border-4 border-white ${user.available ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">{user.full_name}</h2>
                <p className="text-green-600 font-bold tracking-widest text-xs uppercase">{user.specialization}</p>
              </div>
            </div>

            {/* Toggle Component */}
            <div className="bg-gray-50 p-6 rounded-3xl mb-8 flex items-center justify-between border border-gray-100">
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Availability Status</p>
                <p className={`text-sm font-bold ${user.available ? 'text-green-600' : 'text-gray-500'}`}>
                  {user.available ? 'Currently accepting patients' : 'Currently Offline'}
                </p>
              </div>
              <button onClick={handleStatusToggle} className="transition-transform active:scale-90">
                {user.available ? (
                  <ToggleRight size={48} className="text-green-600 fill-green-100" />
                ) : (
                  <ToggleLeft size={48} className="text-gray-300" />
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem icon={<Mail size={18}/>} label="Email" value={user.email} />
              <InfoItem icon={<Phone size={18}/>} label="Phone" value={user.phone} />
              <InfoItem icon={<Calendar size={18}/>} label="Birth Date" value={user.dob} />
              <InfoItem icon={<FileText size={18}/>} label="License ID" value={user.license_no} />
            </div>
          </div>

          <div className="w-full lg:w-80">
            <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest mb-4">Medical Credentials</h3>
            <div className="rounded-[2rem] overflow-hidden border-2 border-dashed border-gray-200 aspect-[3/4] flex items-center justify-center bg-gray-50">
              {user.license_img ? (
                <img src={user.license_img} alt="License" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6 text-gray-400">
                   <FileText size={40} className="mx-auto mb-2" />
                   <p className="text-[10px] font-bold uppercase">Verification Pending</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-50 bg-gray-50/30">
      <div className="text-green-600">{icon}</div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{label}</p>
        <p className="text-sm font-bold text-slate-700">{value || "---"}</p>
      </div>
    </div>
  );
}