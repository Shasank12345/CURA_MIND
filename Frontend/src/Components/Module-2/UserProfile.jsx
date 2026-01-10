import {
  Calendar,
  Phone,
  MapPin,
  Mail,
  Weight,
  Scale,
  Pencil,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* =====================
   SAFE DEFAULT USER
===================== */
const USER_DATA = {
  name: "Ramesh Sharma",
  status: "Active Patient",
  dob: "1998-04-15",
  phone: "+977-9812345678",
  email: "ramesh.sharma@gmail.com",
  address: "Kathmandu, Nepal",
  weight: "68 kg",
  height: "172 cm",
  emergency: {
    name: "Sita Sharma",
    phone: "+977-9801122334",
    email: "sita.sharma@gmail.com",
  },
};

/* =====================
   UTILITY
===================== */
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* =====================
   UI COMPONENTS
===================== */
function Card({ children, className }) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-black shadow-sm hover:shadow-md transition",
        className
      )}
    >
      {children}
    </div>
  );
}

function CardHeader({ children }) {
  return (
    <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex justify-between items-center">
      {children}
    </div>
  );
}

function CardTitle({ children }) {
  return (
    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
      <ShieldCheck size={18} className="text-emerald-600" />
      {children}
    </h2>
  );
}

function CardContent({ children, className }) {
  return <div className={cn("px-6 pb-6", className)}>{children}</div>;
}

function Badge({ children }) {
  return (
    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">
      {children}
    </span>
  );
}

/* =====================
   MAIN COMPONENT
===================== */
export default function UserProfile({ user = USER_DATA }) {
  const navigate = useNavigate(); // ✅ FIX: hook inside component

  const initials =
    user.name?.trim()
      ? user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
      : "U";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f7f7] via-[#f3fbfb] to-white p-8">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* ================= PROFILE HEADER ================= */}
        <Card>
          <CardContent className="flex flex-col md:flex-row gap-6 items-center relative pt-6">

            {/* EDIT BUTTON */}
            <button
              onClick={() => navigate("/userpannel/profileedit")}
              className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition"
            >
              <Pencil size={16} /> Edit Profile
            </button>

            {/* AVATAR */}
            <div className="w-32 h-32 rounded-full bg-emerald-100 flex items-center justify-center border-4 border-white shadow">
              <span className="text-emerald-700 text-3xl font-bold">
                {initials}
              </span>
            </div>

            {/* USER INFO */}
            <div className="flex-1 w-full">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.name || "Unnamed Patient"}
                </h1>
                <Badge>{user.status}</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-600">
                <InfoRow icon={<Calendar size={16} />} value={user.dob} />
                <InfoRow icon={<Phone size={16} />} value={user.phone} />
                <InfoRow icon={<Mail size={16} />} value={user.email} />
                <InfoRow icon={<MapPin size={16} />} value={user.address} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ================= DETAILS SECTION ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* PHYSICAL DETAILS */}
          <Card>
            <CardHeader>
              <CardTitle>Physical Details</CardTitle>
            </CardHeader>
            <CardContent>
              <DetailRow
                icon={<Weight size={16} className="text-emerald-600" />}
                label="Weight"
                value={user.weight}
              />
              <DetailRow
                icon={<Scale size={16} className="text-emerald-600" />}
                label="Height"
                value={user.height}
              />
            </CardContent>
          </Card>

          {/* EMERGENCY CONTACT */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-semibold text-gray-900">
                {user.emergency?.name || "-"}
              </p>
              <p className="text-gray-600">
                {user.emergency?.phone || "-"}
              </p>
              <p className="text-gray-600">
                {user.emergency?.email || "-"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* =====================
   REUSABLE ROWS
===================== */
function InfoRow({ icon, value }) {
  return (
    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 transition">
      <span className="text-emerald-600">{icon}</span>
      <span>{value}</span>
    </div>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex justify-between items-center py-3 border-b last:border-none">
      <span className="flex items-center gap-2 text-gray-600">
        {icon} {label}
      </span>
      <span className="font-medium text-gray-900">
        {value}
      </span>
    </div>
  );
}