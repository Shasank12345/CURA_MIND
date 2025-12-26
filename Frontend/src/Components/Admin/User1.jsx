import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();

  const triageHistory = [
    {
      patientId: "PATIENT-001",
      patientName: "John Doe",
      triageDoctorDate: "2023-10-27",
      assignedDoctorDate: "2023-10-26",
      action: "View Next",
    },
    {
      patientId: "PATIENT-002",
      patientName: "Jane Smith",
      triageDoctorDate: "2023-10-26",
      assignedDoctorDate: "2023-10-25",
      action: "View Next",
    },
    {
      patientId: "PATIENT-003",
      patientName: "Alex Johnson",
      triageDoctorDate: "2023-10-26",
      assignedDoctorDate: "2023-10-25",
      action: "View Next",
    },
  ];

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 via-blue-500 to-slate-600">
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 p-8">
        <h1 className="text-3xl font-bold text-white tracking-wide drop-shadow-md mb-8">
          Patient Triage History
        </h1>

        <div className="bg-white/85 backdrop-blur-xl rounded-2xl shadow-2xl ring-1 ring-black/20 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {triageHistory.map((item) => (
              <div
                key={item.patientId}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition p-5 ring-2 ring-black ring-offset-1 ring-offset-white hover:ring-blue-500"
              >
                <div className="mb-4">
                  <p className="text-sm font-bold text-gray-900">
                    {item.patientName}
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <span></span>
                    <span className="text-xs font-semibold text-blue-600">
                      {item.patientId}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">
                      Triage Date
                    </p>
                    <p className="text-sm font-bold text-gray-800">
                      {item.triageDoctorDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">
                      Assigned Doctor Date
                    </p>
                    <p className="text-sm font-bold text-gray-800">
                      {item.assignedDoctorDate}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    onClick={() => navigate("/adminpannel/patient2")}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-black hover:to-black text-white font-semibold text-xs px-4 py-2 rounded-full transition"
                  >
                    {item.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}