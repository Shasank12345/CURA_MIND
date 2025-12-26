import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function App() {
  return (
    <div className="min-h-screen bg-[#f2f4f8] p-6">
      <Dashboard />
    </div>
  );
}


const pendingData = [
  { day: "Mon", value: 3 },
  { day: "Tue", value: 4 },
  { day: "Wed", value: 5 },
  { day: "Thu", value: 4 },
  { day: "Fri", value: 6 },
  { day: "Sat", value: 7 },
];

const emergencyRate = [
  { name: "Low", value: 2.1 },
  { name: "Medium", value: 2.8 },
  { name: "High", value: 3.2 },
];

const triageOutcome = [
  { name: "Orthopedic", verified: 78, rejected: 22 },
  { name: "Physician", verified: 65, rejected: 35 },
];

function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        
        <Card title="Pending Verifications" badge="7">
          <p className="text-4xl font-extrabold text-gray-900 mb-2">7</p>

          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={pendingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" fontSize={12} />
              <YAxis hide />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Emergency Triage Rate */}
        <Card title="Emergency Triage Rate">
          <div className="flex items-center gap-3 mb-2">
            <p className="text-4xl font-extrabold text-gray-900">3.2%</p>
            <span className="text-orange-500 font-bold text-xl">+</span>
          </div>

          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={emergencyRate}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="value" fill="#fb923c" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

       
        <Card title="Open Consultations">
          <p className="text-4xl font-extrabold text-gray-900 mb-1">12</p>
          <p className="text-xs text-gray-500 font-medium mb-4">
            10 mins triage • High last week
          </p>

          <div className="h-24 flex items-center justify-center text-green-600 font-bold">
            ● Active
          </div>
        </Card>
      </div>

      
      <div className="bg-white rounded-2xl p-6 ring-1 ring-black/10 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          System Overview
        </h3>

        <div className="flex gap-4 mb-6">
          <input
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Search area"
          />
          <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm">
            <option>Specialty: All</option>
          </select>
        </div>

        <p className="text-sm font-semibold text-gray-700 mb-4">
          Triage Outcomes by Specialty
        </p>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={triageOutcome}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="verified" fill="#22c55e" radius={[6, 6, 0, 0]} />
            <Bar dataKey="rejected" fill="#ef4444" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}



function Card({ title, badge, children }) {
  return (
    <div className="bg-white rounded-2xl p-5 ring-1 ring-black/10 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm font-semibold text-gray-700">{title}</p>
        {badge && (
          <span className="text-xs font-bold text-white bg-red-500 px-2 rounded-full">
            ?
          </span>
        )}
      </div>
      {children}
    </div>
  );
}