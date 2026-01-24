import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { User, LogOut, Stethoscope, LayoutDashboard } from "lucide-react";

export default function UserNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isChatbot = location.pathname.includes("chatbot");

  return (
    <div className="h-screen w-full bg-slate-50">
      {/* ---------- NAVBAR ---------- */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
        
        {/* BRANDING */}
        <Link to="/userpannel" className="flex items-center gap-2 group">
          <div className="bg-emerald-600 p-1.5 rounded-lg transition-transform group-hover:scale-105">
            <Stethoscope size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">CuraMind</h1>
        </Link>

        {/* NAVIGATION ACTIONS */}
        <div className="flex items-center gap-6">
          
          {/* Dashboard Link */}
          <button
            onClick={() => navigate("/userpannel")}
            className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors ${
              location.pathname === "/userpannel" ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </button>

          {/* Profile Link */}
          <button
            onClick={() => navigate("/userpannel/Userprofile")}
            className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors ${
              location.pathname.includes("Userprofile") ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <User size={16} />
            Profile
          </button>

          {/* Vertical Divider */}
          <div className="h-6 w-[1px] bg-slate-200"></div>

          {/* Logout - Elegant red hover, not solid red */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* ---------- PAGE CONTENT ---------- */}
      <main
        className={`pt-16 h-full ${
          isChatbot ? "overflow-hidden" : "overflow-y-auto"
        }`}
      >
        <div className={isChatbot ? "h-full" : "max-w-7xl mx-auto"}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}