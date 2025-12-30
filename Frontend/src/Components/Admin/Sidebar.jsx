import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { LayoutGrid, Users, Stethoscope, ClipboardList } from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: <LayoutGrid className="w-6 h-6" />, label: "Dashboard", path: "dashboard" },
    { icon: <Users className="w-6 h-6" />, label: "Users", path: "user1" },
    { icon: <Stethoscope className="w-6 h-6" />, label: "Doctors", path: "doctordetail" },
    {
      icon: <ClipboardList className="w-6 h-6" />,
      label: "Verification Queue",
      path: "doctorresponse1",
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
                <span
                  className={`${
                    active ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {item.icon}
                </span>

                <span className="text-lg">
                  {item.label}
                </span>

                {item.badge && item.badge > 0 && (
                  <span className="ml-auto w-7 h-7 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

      
        <div className="pt-6 border-t border-gray-200 text-sm text-gray-500 font-medium">
          © 2025 CuraMind
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 ml-72 p-8">
        <Outlet />
      </main>
    </div>
  );
}