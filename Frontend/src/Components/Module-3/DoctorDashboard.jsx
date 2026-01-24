import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  FileText,
  CheckCircle,
  XCircle,
  Calendar,
  Eye,
  Edit,
  Clock,
  Trash2,
  Plus,
} from "lucide-react";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState(doctorsData);

  const activeDoctor = doctors[0];

  const handleViewSOAP = (noteId) => {
    navigate(`/soap/${noteId}`);
  };

  const handleVerification = (noteId, decision) => {
    setDoctors((prev) =>
      prev.map((doc) =>
        doc.id === activeDoctor.id
          ? {
              ...doc,
              soapNotes: doc.soapNotes.map((note) =>
                note.id === noteId
                  ? { ...note, verificationStatus: decision }
                  : note
              ),
            }
          : doc
      )
    );
  };

  const addActiveTime = () => {
    setDoctors((prev) =>
      prev.map((doc) =>
        doc.id === activeDoctor.id
          ? {
              ...doc,
              activeTimes: [...(doc.activeTimes || []), { from: "", to: "" }],
            }
          : doc
      )
    );
  };

  const updateActiveTime = (index, field, value) => {
    setDoctors((prev) =>
      prev.map((doc) =>
        doc.id === activeDoctor.id
          ? {
              ...doc,
              activeTimes: doc.activeTimes.map((time, i) =>
                i === index ? { ...time, [field]: value } : time
              ),
            }
          : doc
      )
    );
  };

  const deleteActiveTime = (index) => {
    setDoctors((prev) =>
      prev.map((doc) =>
        doc.id === activeDoctor.id
          ? {
              ...doc,
              activeTimes: doc.activeTimes.filter((_, i) => i !== index),
            }
          : doc
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* ================= PROFILE CARD ================= */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        {/* Header */}
        <div className="h-20 bg-gradient-to-r from-blue-600 to-blue-500 relative">
          <button
            onClick={() => navigate("/doctordashboard/editprofile")}
            className="absolute right-4 top-4 flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-50 shadow"
          >
            <Edit size={16} />
            Edit Profile
          </button>
        </div>

        <div className="p-6 flex flex-col md:flex-row gap-6">
          {/* Profile Image */}
          <div className="-mt-5.5 flex-shrink-0">
            <img
              src={activeDoctor.photo}
              alt="Doctor"
              className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover bg-white"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{activeDoctor.name}</h2>
            <p className="text-blue-600 text-sm mb-4">
              {activeDoctor.specialization}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail size={16} /> {activeDoctor.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} /> {activeDoctor.phone}
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} /> DOB: {activeDoctor.dob}
              </div>
              <div className="flex items-center gap-2">
                <FileText size={16} /> License: {activeDoctor.license}
              </div>
            </div>

            {/* Active Time */}
            <div className="mt-6">
              <h4 className="flex items-center gap-2 text-sm font-semibold mb-3">
                <Clock size={16} />
                Active Time
              </h4>

              <div className="flex flex-wrap gap-2 mb-3">
                {activeDoctor.activeTimes?.map(
                  (time, index) =>
                    time.from &&
                    time.to && (
                      <span
                        key={index}
                        className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        {time.from} – {time.to}
                        <button
                          onClick={() => deleteActiveTime(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </button>
                      </span>
                    )
                )}
              </div>

              <div className="space-y-2">
                {activeDoctor.activeTimes?.map(
                  (time, index) =>
                    (!time.from || !time.to) && (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="time"
                          value={time.from}
                          onChange={(e) =>
                            updateActiveTime(index, "from", e.target.value)
                          }
                          className="border rounded-md px-2 py-1 text-sm"
                        />
                        <input
                          type="time"
                          value={time.to}
                          onChange={(e) =>
                            updateActiveTime(index, "to", e.target.value)
                          }
                          className="border rounded-md px-2 py-1 text-sm"
                        />
                        <button
                          onClick={() => deleteActiveTime(index)}
                          className="text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )
                )}
              </div>

              <button
                onClick={addActiveTime}
                className="mt-3 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
              >
                <Plus size={16} />
                Add Time
              </button>
            </div>
          </div>

          {/* License */}
          <div className="w-full md:w-80">
            <p className="text-sm font-medium mb-2">Medical License</p>
            <img
              src={activeDoctor.licenseImage}
              alt="License"
              className="rounded-lg border object-cover"
            />
          </div>
        </div>
      </div>

      {/* ================= SOAP NOTIFICATIONS ================= */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold">SOAP Notifications</h3>
        <p className="text-sm text-gray-500 mb-4">
          Accept, reject, or view SOAP notes
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3">Note ID</th>
                <th className="p-3">Patient</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {activeDoctor.soapNotes.map((note) => (
                <tr key={note.id} className="border-b last:border-none">
                  <td className="p-3">{note.id}</td>
                  <td className="p-3">{note.patient}</td>
                  <td className="p-3">{note.date}</td>
                  <td className="p-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleViewSOAP(note.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md"
                    >
                      <Eye size={14} /> View
                    </button>

                    {note.verificationStatus === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleVerification(note.id, "accepted")
                          }
                          className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-md"
                        >
                          <CheckCircle size={14} /> Accept
                        </button>
                        <button
                          onClick={() =>
                            handleVerification(note.id, "rejected")
                          }
                          className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-md"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </>
                    )}

                    {note.verificationStatus === "accepted" && (
                      <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">
                        Accepted
                      </span>
                    )}

                    {note.verificationStatus === "rejected" && (
                      <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full">
                        Rejected
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ================= MOCK DATA ================= */

const doctorsData = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialization: "Cardiology",
    email: "sarah.johnson@hospital.com",
    phone: "+1 (555) 123-4567",
    dob: "1985-04-12",
    license: "MD-2024-789456",
    photo: "https://i.pravatar.cc/150?img=47",
    licenseImage:
      "https://images.unsplash.com/photo-1589758438368-0ad531db3366",
    activeTimes: [],
    soapNotes: [
      {
        id: "SOAP-001",
        patient: "John Smith",
        date: "Jan 9, 2026",
        verificationStatus: "pending",
      },
      {
        id: "SOAP-002",
        patient: "Emily Davis",
        date: "Jan 8, 2026",
        verificationStatus: "pending",
      },
    ],
  },
];