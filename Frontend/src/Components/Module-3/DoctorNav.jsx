import { Outlet, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function DoctorLayout() {
  const navigate = useNavigate();

  return (
   <div className="min-h-screen bg-gray-50 overflow-hidden">

      {/* ================= NAVBAR ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
          
          {/* LEFT */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Doctor Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Welcome, Dr. Sarah Johnson 👋
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            <button
             onClick={() => navigate("/doctordashboard/onetoonechat")}
            className="px-5 py-2 rounded-full border border-blue-400 text-blue-600 hover:bg-blue-50 transition">
              Connect
            </button>
  
            <button  
            onClick={() => navigate("/doctordashboard/Profile")}
            className="px-5 py-2 rounded-full border border-blue-400 text-blue-600 hover:bg-blue-50 transition">
              Profile
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-5 py-2 rounded-full border border-red-400 text-red-500 hover:bg-red-50 transition flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ================= PAGE CONTENT ================= */}
      <main className="pt-16 px-6">
        <Outlet />
      </main>
    </div>
  );
}
