import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";

export default function UserNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isChatbot = location.pathname.includes("chatbot");

  return (
    <div className="h-screen w-full bg-gray-100">
      {/* ---------- NAVBAR ---------- */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-gradient-to-r from-cyan-500 to-green-400 shadow-lg flex items-center justify-between px-6 text-white rounded-b-xl">
        <h1 className="text-2xl font-bold tracking-wide">CuraMind</h1>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/userpannel/Userprofile")}
            className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-lg hover:bg-red-500 transition"
          >
            <User size={18} />
            Profile
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-lg hover:bg-red-500 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      {/* ---------- PAGE CONTENT ---------- */}
      <main
        className={`pt-16 h-[calc(100vh-4rem)] ${
          isChatbot ? "overflow-hidden" : "overflow-y-auto"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
