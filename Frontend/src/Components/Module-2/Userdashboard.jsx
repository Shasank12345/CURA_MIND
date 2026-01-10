import {
  Stethoscope,
  Loader2,
  FileText,
  Lightbulb,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Link} from "react-router-dom";

/* ---------------- Simple UI Components ---------------- */

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white ${className}`}>
      {children}
    </div>
  );
}

function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-md text-sm font-medium transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/* ----------------------------- Header ----------------------------- */
/* Fixed ONLY for dashboard */

// function DashboardHeader() {
//   const navigate = useNavigate();

//   return (
//     <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-gradient-to-r from-emerald-400 to-teal-400 flex items-center justify-between px-6 shadow">
//       <h1 className="text-white text-xl font-semibold">
//         CuraMind
//       </h1>

//       <div className="flex items-center gap-3">
//         <button className="flex items-center gap-1 text-white bg-white/20 px-3 py-1.5 rounded-md hover:bg-white/30">
//           <User className="w-4 h-4" />
//           Profile
//         </button>

//         {/* Logout redirects to /login */}
//         <button
//           onClick={() => navigate("/login")}
//           className="flex items-center gap-1 text-white bg-white/20 px-3 py-1.5 rounded-md hover:bg-white/30"
//         >
//           <LogOut className="w-4 h-4" />
//           Logout
//         </button>
//       </div>
//     </header>
//   );
// }

/* --------------------------- Welcome Card --------------------------- */

function WelcomeCard({ userName }) {
  return (
    <Card className="p-6 shadow-sm">
      <h2 className="text-2xl font-semibold mb-1">
        Welcome, {userName} 👋
      </h2>
      <p className="text-gray-600">
        You have a new assessment result
      </p>
    </Card>
  );
}

/* -------------------------- Action Cards ---------------------------- */

function ActionCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* SAME PAGE navigation */}
      <Link to="/userpannel/chatbot" className="block">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white p-8 flex flex-col items-center justify-center cursor-pointer hover:from-green-600 hover:to-green-700 transition shadow-md hover:scale-[1.02]">
          <FileText className="w-12 h-12 mb-4" />
          <h3 className="text-xl font-medium text-center">
            Start New Ankle Assessment
          </h3>
        </Card>
      </Link>

      {/* Consult Doctor (Locked) */}
       <Link to="/userpannel/onetoonechat" className="block">
      <Card className="group bg-gradient-to-br from-purple-600 to-purple-700 text-white p-8 relative overflow-hidden shadow-md cursor-pointer transition hover:scale-[1.02]">
        <div className="flex flex-col items-center justify-center h-full transition-opacity duration-300 group-hover:opacity-20">
          <Stethoscope className="w-12 h-12 mb-4" />
          <h3 className="text-xl font-medium text-center">
            Consult Doctor
          </h3>
        </div>
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Loader2 className="w-10 h-10 text-gray-400 mb-3 animate-spin" />
          <h3 className="text-lg text-gray-700">
            Consult Specialist
          </h3>
          <p className="text-sm text-gray-500">
            Complete an assessment first
          </p>
        </div>
      </Card>
        </Link>
    </div>
  );
}

/* ---------------------- Immediate Care Advice ----------------------- */

function ImmediateCareAdvice() {
  return (
    <Card className="p-6 bg-amber-50 border border-amber-200 shadow-sm">
      <div className="flex items-start gap-3">
        <Lightbulb className="w-6 h-6 text-amber-600 mt-1" />
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Immediate Care Advice
          </h3>
          <h4 className="text-amber-800 mb-1">
            R.I.C.E Protocol
          </h4>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li><strong>Rest</strong> – Avoid weight bearing</li>
            <li><strong>Ice</strong> – 15–20 minutes every 2–3 hours</li>
            <li><strong>Compression</strong> – Elastic bandage</li>
            <li><strong>Elevation</strong> – Above heart level</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}

/* ------------------------- Triage History --------------------------- */

function TriageHistory({ triageHistory = [] }) {
  return (
    <Card className="p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-gray-600" />
        <h3 className="text-xl font-semibold">
          Triage History
        </h3>
      </div>

      {triageHistory.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No triage history available
        </p>
      ) : (
        <div className="space-y-4">
          {triageHistory.map((entry) => (
            <div
              key={entry.id}
              className="border-b border-gray-200 pb-4 last:border-0"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="min-w-[120px]">
                    <p className="font-medium">{entry.date}</p>
                    <p className="text-sm text-gray-500">{entry.subtitle}</p>
                  </div>

                  <div>
                    {entry.statusType === "warning" ? (
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="font-medium">{entry.title}</p>
                    <p className="text-sm text-gray-500">{entry.status}</p>
                  </div>
                </div>

                <Button className="bg-green-500 text-white hover:bg-green-600">
                  View SOAP Note
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

/* ---------------------------- Dashboard ----------------------------- */

export default function UserDashboard({
  userName = "Patient",
  triageHistory = [],
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <DashboardHeader /> */}

      {/* offset for fixed header */}
      <main className="max-w-6xl mx-auto p-6 pt-24 space-y-6">
        <WelcomeCard userName={userName} />
        <ActionCards />
        <ImmediateCareAdvice />
        <TriageHistory triageHistory={triageHistory} />
      </main>
    </div>
  );
}
