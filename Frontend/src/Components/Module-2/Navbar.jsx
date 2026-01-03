import { Outlet, useLocation } from "react-router-dom";
import { User, LogOut } from "lucide-react";

export default function UserNavbar() {
  const location = useLocation();

  // Check if current route is chatbot
  const isChatbot = location.pathname.includes("chatbot");

  return (
    <div className="h-screen w-full bg-gray-100">
      {/* ---------- NAVBAR ---------- */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-gradient-to-r from-teal-400 to-emerald-400 flex items-center justify-between px-6 text-white shadow">
        <h1 className="text-xl font-semibold">CuraMind</h1>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded">
            <User size={16} />
            Profile
          </button>

          <button className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* ---------- PAGE CONTENT ---------- */}
      <main
        className={`pt-14 h-screen ${
          isChatbot ? "overflow-hidden" : "overflow-y-auto"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
