import { useState } from "react";
import { MoreVertical, Send, X, LogOut } from "lucide-react";

const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Williams",
    role: "General Physician",
    online: true,
    experience: "10+ Years Experience",
    hospital: "City Care Hospital",
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    role: "Cardiologist",
    online: false,
    experience: "12+ Years Experience",
    hospital: "Heart Center",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    role: "Dermatologist",
    online: false,
    experience: "8+ Years Experience",
    hospital: "Skin Health Clinic",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    id: 4,
    name: "Dr. James Thompson",
    role: "Orthopedic Surgeon",
    online: false,
    experience: "15+ Years Experience",
    hospital: "Ortho Plus Hospital",
    avatar: "https://i.pravatar.cc/150?img=56",
  },
];

const initialChats = {
  1: [{ from: "doctor", text: "Hello! I reviewed your recent blood work results." }],
  2: [{ from: "doctor", text: "Please monitor your blood pressure daily." }],
  3: [{ from: "doctor", text: "Apply the cream twice daily." }],
  4: [{ from: "doctor", text: "Your X-ray shows good healing progress." }],
};

export default function App() {
  const [selected, setSelected] = useState(doctors[0]);
  const [chats, setChats] = useState(initialChats);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const messages = chats[selected.id] || [];

  const filteredDoctors = doctors.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  const sendMessage = () => {
    if (!input.trim()) return;

    setChats((prev) => ({
      ...prev,
      [selected.id]: [...(prev[selected.id] || []), { from: "patient", text: input }],
    }));
    setInput("");

    // Fake doctor reply after 1s
    setTimeout(() => {
      setChats((prev) => ({
        ...prev,
        [selected.id]: [
          ...(prev[selected.id] || []),
          {
            from: "doctor",
            text: "Thanks for the update. Please continue your care and let me know if anything changes.",
          },
        ],
      }));
    }, 1000);
  };

  return (
   <div className="h-[calc(100vh-64px)] flex bg-gray-100 overflow-hidden">

      {/* Sidebar */}
      <div className="w-80 bg-white border-r flex flex-col">
        <div>
          <div className="p-6 text-2xl font-bold text-emerald-600">🍃 CuraMind</div>
          <div className="px-4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 rounded-full bg-gray-100 border focus:ring-2 focus:ring-emerald-400 text-sm"
              placeholder="Search"
            />
          </div>

          <div className="mt-5 space-y-2 px-3">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelected(doc)}
                className={`p-3 rounded-xl cursor-pointer transition ${
                  selected.id === doc.id
                    ? "bg-emerald-50 border border-emerald-200"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={doc.avatar}
                    className="w-11 h-10 rounded-full border-2 border-emerald-300"
                    alt={doc.name}
                  />
                  <div>
                    <div className="text-sm font-semibold">{doc.name}</div>
                    <div className="text-xs text-gray-500">{doc.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-14 bg-white border-b flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <img src={selected.avatar} className="w-11 h-11 rounded-full" />
            <div>
              <div className="font-semibold">{selected.name}</div>
              <div className="text-xs text-emerald-600">
                {selected.online ? "Online" : "Offline"} • {selected.role}
              </div>
            </div>
          </div>

          <div className="relative">
            <MoreVertical
              className="cursor-pointer text-gray-500 hover:text-emerald-600"
              onClick={() => setMenuOpen(!menuOpen)}
            />
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow border">
                <button
                  onClick={() => {
                    setShowProfile(true);
                    setMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-sm hover:bg-emerald-50 hover:text-emerald-600 text-left"
                >
                  👨‍⚕️ View Profile
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 min-h-0">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.from === "patient" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-5 py-3 rounded-2xl max-w-md text-sm shadow ${
                  m.from === "patient" ? "bg-emerald-600 text-white" : "bg-white text-gray-800"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 px-5 py-3 rounded-full bg-gray-100 border focus:ring-2 focus:ring-emerald-400 text-sm"
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-full transition"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 relative">
            <X
              className="absolute top-4 right-4 cursor-pointer hover:text-red-500"
              onClick={() => setShowProfile(false)}
            />
            <div className="flex flex-col items-center text-center">
              <img
                src={selected.avatar}
                className="w-24 h-24 rounded-full mb-3 border-4 border-emerald-400"
              />
              <h2 className="text-lg font-semibold">{selected.name}</h2>
              <p className="text-sm text-gray-500">{selected.role}</p>

              <div className="mt-4 space-y-2 text-sm">
                <p>🏥 {selected.hospital}</p>
                <p>📅 {selected.experience}</p>
                <p className="text-emerald-600 font-medium">
                  {selected.online ? "Currently Online" : "Currently Offline"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}