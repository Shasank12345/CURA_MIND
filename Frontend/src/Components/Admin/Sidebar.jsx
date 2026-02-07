import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  Users,
  Stethoscope,
  ClipboardList,
  MessageSquare,
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      icon: <LayoutGrid className="w-6 h-6" />,
      label: "Dashboard",
      path: "dashboard",
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: "Users",
      path: "User1",
    },
    {
      icon: <Stethoscope className="w-6 h-6" />,
      label: "Doctors",
      path: "doctordetail",
    },
    {
      icon: <ClipboardList className="w-6 h-6" />,
      label: "Verification Queue",
      path: "doctorresponse1",
    },

    
    {
      icon: <MessageSquare className="w-6 h-6" />,
      label: "Message Triage",
      path: "message-triage",
    },
  ];

  return (
    <div className="flex bg-gray-100 min-h-screen">
      
      {/* Sidebar */}
      <aside className="w-72 h-screen fixed top-0 left-0 bg-white border-r border-gray-300 px-6 py-8 flex flex-col shadow-sm">

        {/* Brand */}
        <div className="mb-10">
          <h2 className="text-gray-900 font-extrabold text-3xl tracking-wide">
            CuraMind
          </h2>
          <p className="text-gray-500 text-lg font-semibold">
            Admin Panel
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-3">
          {navItems.map((item, index) => {
            const active = location.pathname.includes(item.path);

            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left transition-all
                  ${
                    active
                      ? "bg-gray-200 text-gray-900 font-bold shadow-inner"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
              >
                <span className={`${active ? "text-gray-900" : "text-gray-400"}`}>
                  {item.icon}
                </span>

                <span className="text-lg">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={() => navigate("/")}
          className="mt-6 mb-2 w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
        >
          Logout
        </button>

        {/* Trademark */}
        <div className="pt-2 border-t border-gray-200 text-sm text-gray-500 font-medium">
          © 2025 CuraMind
        </div>
      </aside>

    
      <main className="flex-1 ml-72 p-8">
        <Outlet />
      </main>
    </div>
  );
}
