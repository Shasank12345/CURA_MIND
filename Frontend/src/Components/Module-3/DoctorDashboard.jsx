import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, CheckCircle, XCircle, ClipboardList } from "lucide-react";

/* ================= MOCK DATA ================= */

const doctorsData = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    soapNotes: [
      { id: "SOAP-001", patient: "John Smith", date: "Jan 9, 2026", verificationStatus: "pending" },
      { id: "SOAP-002", patient: "Emily Davis", date: "Jan 8, 2026", verificationStatus: "pending" },
      { id: "SOAP-003", patient: "Michael Brown", date: "Jan 7, 2026", verificationStatus: "accepted" },
    ],
  },
];

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState(doctorsData);

  const activeDoctor = doctors[0];

  const handleViewSOAP = (noteId) => {
    navigate(`/doctordashboard/views/${noteId}`);
  };

  const handleVerification = (noteId, decision) => {
    setDoctors((prev) =>
      prev.map((doc) =>
        doc.id === activeDoctor.id
          ? {
              ...doc,
              soapNotes: doc.soapNotes.map((note) =>
                note.id === noteId ? { ...note, verificationStatus: decision } : note
              ),
            }
          : doc
      )
    );
  };

  const pending = activeDoctor.soapNotes.filter(n => n.verificationStatus === "pending").length;
  const accepted = activeDoctor.soapNotes.filter(n => n.verificationStatus === "accepted").length;
  const rejected = activeDoctor.soapNotes.filter(n => n.verificationStatus === "rejected").length;

  return (
    <div className="min-h-screen bg-slate-50 px-6 pt-20 pb-6">

      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">
          Welcome, {activeDoctor.name} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Review. Verify. Deliver better care.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard title="Pending SOAPs" value={pending} color="yellow" />
        <StatCard title="Accepted SOAPs" value={accepted} color="green" />
        <StatCard title="Rejected SOAPs" value={rejected} color="red" />
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardList className="text-blue-600" />
          <h3 className="text-lg font-semibold">SOAP Notifications</h3>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Review and verify SOAP notes submitted for your approval
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left text-gray-600">
              <tr>
                <th className="p-3">Note ID</th>
                <th className="p-3">Patient</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {activeDoctor.soapNotes.map((note) => (
                <tr key={note.id} className="border-b last:border-none hover:bg-slate-50">
                  <td className="p-3 font-medium">{note.id}</td>
                  <td className="p-3">{note.patient}</td>
                  <td className="p-3">{note.date}</td>

                  <td className="p-3 flex flex-wrap gap-2 items-center">

                    <button
                      onClick={() => handleViewSOAP(note.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                    >
                      <Eye size={14} />
                      View
                    </button>

                    {note.verificationStatus === "pending" && (
                      <>
                        <button
                          onClick={() => handleVerification(note.id, "accepted")}
                          className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                        >
                          <CheckCircle size={14} />
                          Accept
                        </button>

                        <button
                          onClick={() => handleVerification(note.id, "rejected")}
                          className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                      </>
                    )}

                    {note.verificationStatus !== "pending" && (
                      <StatusBadge status={note.verificationStatus} />
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



const StatCard = ({ title, value, color }) => {
  const colors = {
    green: "bg-green-50 text-green-700",
    red: "bg-red-50 text-red-700",
    yellow: "bg-yellow-50 text-yellow-700",
  };

  return (
    <div className={`rounded-xl p-5 shadow-sm ${colors[color]}`}>
      <p className="text-sm">{title}</p>
      <h2 className="text-3xl font-semibold mt-1">{value}</h2>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
