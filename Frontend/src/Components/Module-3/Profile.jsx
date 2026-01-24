import {
  Mail,
  Phone,
  Calendar,
  FileText,
  Pencil,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const user = {
    name: "Dr. Sarah Johnson",
    specialization: "Cardiology",
    email: "sarah.johnson@hospital.com",
    phone: "+1 (555) 123-4567",
    dob: "1985-04-12",
    license: "MD-2024-789456",
    avatar: "https://i.pravatar.cc/150?img=47",
    licenseImage:
      "https://images.unsplash.com/photo-1601597111158-2fceff292cdc",
    status: "online", // 🔹 "online" | "offline"
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Header */}
        <div className="bg-blue-600 h-20 relative">
          <button 
           onClick={() => navigate("/doctordashboard/EditProfile")}
          className="absolute top-5 right-6 flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg shadow text-sm font-medium hover:bg-blue-50">
            <Pencil size={16} />
            Edit Profile
          </button>
        </div>
       

        {/* Content */}
        <div className="p-6 flex flex-col lg:flex-row gap-8">

          {/* Left */}
          <div className="flex-1 flex gap-6">
            {/* Avatar */}
            <img
              src={user.avatar}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-white shadow -mt-5 object-cover"
            />

            {/* Info */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {user.name}
              </h2>

              <p className="text-blue-600 font-medium mb-2">
                {user.specialization}
              </p>

              {/* Online / Offline BOTH */}
              <div className="flex gap-3 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border
                    ${
                      user.status === "online"
                        ? "bg-green-100 text-green-700 border-green-300"
                        : "bg-gray-100 text-gray-500 border-gray-300"
                    }`}
                >
                  ● Online
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border
                    ${
                      user.status === "offline"
                        ? "bg-red-100 text-red-700 border-red-300"
                        : "bg-gray-100 text-gray-500 border-gray-300"
                    }`}
                >
                  ● Offline
                </span>
              </div>

              <div className="space-y-2 text-gray-600 text-sm">
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  {user.email}
                </div>

                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  DOB: {user.dob}
                </div>

                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  {user.phone}
                </div>

                <div className="flex items-center gap-2">
                  <FileText size={16} />
                  License: {user.license}
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="w-full lg:w-96">
            <h3 className="font-semibold text-gray-800 mb-3">
              Medical License
            </h3>

            <div className="border rounded-xl overflow-hidden shadow-sm">
              {user.licenseImage ? (
                <img
                  src={user.licenseImage}
                  alt="Medical License"
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
                  No license uploaded
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
