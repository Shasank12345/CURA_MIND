import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  Save,
  ArrowLeft,
  Camera,
} from "lucide-react";

export default function EditDoctorProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "Dr. Sarah Johnson",
    specialization: "Cardiology",
    email: "sarah.johnson@hospital.com",
    phone: "+1 (555) 123-4567",
    dob: "1985-04-12",
    license: "MD-2024-789456",
    photo: "https://i.pravatar.cc/150?img=47",
    licenseImage:
      "https://images.unsplash.com/photo-1589758438368-0ad531db3366",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-md hover:bg-slate-100"
            >
              <ArrowLeft size={18} />
            </button>
            <h2 className="text-xl font-semibold">Edit Profile</h2>
          </div>

          <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700">
            <Save size={16} />
            Save Changes
          </button>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left – Profile Image */}
          <div className="flex flex-col items-center">
            <img
              src={formData.photo}
              alt="Doctor"
              className="w-36 h-36 rounded-full border-4 border-white shadow"
            />

            <button className="mt-4 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800">
              <Camera size={16} />
              Change Photo
            </button>
          </div>

          {/* Right – Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <section>
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  icon={User}
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                <Input
                  label="Specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                />
                <Input
                  icon={Mail}
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <Input
                  icon={Phone}
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <Input
                  icon={Calendar}
                  type="date"
                  label="Date of Birth"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>
            </section>

            {/* License Info */}
            <section>
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Medical License
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <Input
                  icon={FileText}
                  label="License Number"
                  name="license"
                  value={formData.license}
                  onChange={handleChange}
                />

                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    License Document
                  </p>
                  <img
                    src={formData.licenseImage}
                    alt="License"
                    className="rounded-lg border mb-2"
                  />
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    Upload New Document
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= Reusable Input ================= */

function Input({ label, icon: Icon, ...props }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        )}
        <input
          {...props}
          className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            Icon ? "pl-9" : ""
          }`}
        />
      </div>
    </div>
  );
}