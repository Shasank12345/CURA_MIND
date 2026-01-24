import { useState } from "react";
import { Phone, User } from "lucide-react";

/* ================= MOCK DATA ================= */

const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    phone: "+1 (555) 123-4567",
    specialization: "Cardiology",
    photo: "https://i.pravatar.cc/150?img=47",
    experience: "10+ Years",
    hospital: "City Care Hospital",
  },
  {
    id: 2,
    name: "Dr. Michael Brown",
    phone: "+1 (555) 987-6543",
    specialization: "Neurology",
    photo: "https://i.pravatar.cc/150?img=12",
    experience: "8 Years",
    hospital: "Neuro Health Center",
  },
];

/* ================= COMPONENT ================= */

export default function AvailableDoctorList() {
  const [hoveredDoctor, setHoveredDoctor] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center px-4 pt-20 pb-10">
      
      {/* Main Container */}
      <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-2xl shadow-md p-8">
        
        {/* Header */}
        <div className="mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Available Doctors
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View and check doctor availability
          </p>
        </div>

        {/* Doctor List */}
        <div className="space-y-5">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="relative z-10 flex items-center justify-between 
                         p-5 rounded-xl border border-gray-200 bg-gray-50
                         hover:bg-white hover:shadow-lg hover:z-20 transition-all duration-200"
            >
              {/* Doctor Info */}
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {doctor.name}
                </p>

                <div className="mt-1 text-sm text-gray-600 flex items-center gap-2">
                  <Phone size={15} className="text-gray-400" />
                  {doctor.phone}
                </div>

                <p className="mt-2 text-sm font-medium text-blue-600">
                  {doctor.specialization}
                </p>
              </div>

              {/* Profile Button */}
              <div className="relative">
                <button
                  onMouseEnter={() => setHoveredDoctor(doctor)}
                  onMouseLeave={() => setHoveredDoctor(null)}
                  className="flex items-center gap-2 px-5 py-2.5 
                             text-sm font-semibold bg-blue-600 text-white 
                             rounded-lg border border-blue-700
                             hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <User size={16} />
                  View Profile
                </button>

                {/* Hover Profile Card */}
                {hoveredDoctor?.id === doctor.id && (
                  <div
                    className="absolute right-0 top-12 z-[9999] w-72 
                               bg-white border border-gray-200 
                               rounded-xl shadow-2xl p-5 animate-in fade-in zoom-in duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={doctor.photo}
                        alt={doctor.name}
                        className="w-14 h-14 rounded-full border border-gray-200 object-cover"
                      />
                      <div>
                        <p className="font-bold text-gray-900">
                          {doctor.name}
                        </p>
                        <p className="text-xs font-medium text-blue-600">
                          {doctor.specialization}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-700 space-y-2">
                      <p className="flex justify-between">
                        <span className="text-gray-500">Hospital:</span>
                        <span className="font-medium text-right">{doctor.hospital}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-500">Experience:</span>
                        <span className="font-medium">{doctor.experience}</span>
                      </p>
                      <div className="flex items-center gap-2 pt-1 text-gray-600">
                        <Phone size={14} className="text-blue-500" />
                        {doctor.phone}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}