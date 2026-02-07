import { useState } from "react";
import {
  MessageSquare,
  AlertTriangle,
  User,
  Hash,
  Clock,
  ShieldCheck,
} from "lucide-react";

export default function MessageTriage() {
  /* ================= STATIC DATA ================= */

  const messageHistory = [
    {
      triage_id: 1,
      sender_name: "John Doe",
      category: "Emergency",
    },
    {
      triage_id: 2,
      sender_name: "Sarah Smith",
      category: "General Inquiry",
    },
    {
      triage_id: 3,
      sender_name: "Alex Johnson",
      category: "Follow-up",
    },
  ];

  const messageDetails = {
    1: {
      sender_info: {
        name: "John Doe",
        role: "Patient",
        user_id: "P-102",
      },
      timestamp: "2026-02-07 14:30",
      message_text: "I have severe chest pain and difficulty breathing.",
      category: "Emergency",
      urgency_level: "High",
      suggested_response: "Call emergency services immediately.",
    },

    2: {
      sender_info: {
        name: "Sarah Smith",
        role: "Patient",
        user_id: "P-205",
      },
      timestamp: "2026-02-06 11:15",
      message_text: "Can I reschedule my appointment for next week?",
      category: "General Inquiry",
      urgency_level: "Low",
      suggested_response: "Yes, please contact reception for rescheduling.",
    },

    3: {
      sender_info: {
        name: "Alex Johnson",
        role: "Patient",
        user_id: "P-309",
      },
      timestamp: "2026-02-05 09:45",
      message_text: "My medicine is finished, should I continue?",
      category: "Follow-up",
      urgency_level: "Medium",
      suggested_response: "Consult your doctor before stopping medication.",
    },
  };

  /* ================= STATE ================= */

  const [selectedId, setSelectedId] = useState(messageHistory[0].triage_id);
  const [detail, setDetail] = useState(messageDetails[1]);

  /* ================= HANDLE CLICK ================= */

  const handleSelect = (id) => {
    setSelectedId(id);
    setDetail(messageDetails[id]);
  };

  return (
    <div className="flex h-[calc(100vh-60px)] bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm m-4">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-72 border-r border-gray-100 flex flex-col bg-gray-50">
        <div className="p-5 border-b border-gray-200 bg-white">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <MessageSquare size={14} /> Message Triage
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {messageHistory.map((msg) => (
            <div
              key={msg.triage_id}
              onClick={() => handleSelect(msg.triage_id)}
              className={`px-5 py-4 cursor-pointer border-b border-gray-100 transition-colors ${
                selectedId === msg.triage_id
                  ? "bg-white border-l-4 border-l-green-600"
                  : "hover:bg-gray-100"
              }`}
            >
              <p
                className={`text-sm font-semibold ${
                  selectedId === msg.triage_id
                    ? "text-green-700"
                    : "text-gray-700"
                }`}
              >
                {msg.sender_name}
              </p>

              <p className="text-[10px] text-gray-400 mt-1 uppercase">
                Category: {msg.category}
              </p>
            </div>
          ))}
        </div>
      </aside>

      {/* ================= DETAIL VIEW ================= */}
      <main className="flex-1 bg-white overflow-y-auto">
        {detail ? (
          <div className="max-w-3xl mx-auto py-12 px-8">

            {/* HEADER */}
            <header className="mb-10 border-b border-gray-100 pb-8 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {detail.sender_info.name}
                </h1>

                <div className="flex gap-5 mt-2">
                  <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
                    <User size={12} /> Role: {detail.sender_info.role}
                  </span>

                  <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
                    <Hash size={12} /> ID: {detail.sender_info.user_id}
                  </span>

                  <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
                    <Clock size={12} /> {detail.timestamp}
                  </span>
                </div>
              </div>

              <div className="text-green-600 bg-green-50 p-3 rounded-lg">
                <ShieldCheck size={24} />
              </div>
            </header>

            {/* MESSAGE TRIAGE CONTENT */}
            <div className="space-y-10">

              {/* Message */}
              <section className="grid grid-cols-4 gap-4">
                <span className="text-[10px] font-black uppercase text-gray-400">
                  Message
                </span>
                <p className="col-span-3 border-l-2 pl-4 text-sm text-gray-700">
                  {detail.message_text}
                </p>
              </section>

              {/* Category */}
              <section className="grid grid-cols-4 gap-4">
                <span className="text-[10px] font-black uppercase text-gray-400">
                  Category
                </span>
                <p className="col-span-3 border-l-2 pl-4 text-sm text-gray-700">
                  {detail.category}
                </p>
              </section>

              {/* Urgency */}
              <section className="grid grid-cols-4 gap-4">
                <span className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-1">
                  <AlertTriangle size={14} className="text-red-500" />
                  Urgency
                </span>
                <p className="col-span-3 border-l-2 pl-4 text-sm text-gray-700">
                  {detail.urgency_level}
                </p>
              </section>

              {/* Suggestion */}
              <section className="grid grid-cols-4 gap-4">
                <span className="text-[10px] font-black uppercase text-gray-400">
                  AI Suggestion
                </span>
                <p className="col-span-3 border-l-2 pl-4 text-sm text-gray-700">
                  {detail.suggested_response}
                </p>
              </section>
            </div>

            {/* FOOTER */}
            <footer className="mt-20 pt-8 border-t border-gray-100">
              <p className="text-[9px] text-gray-300 font-bold uppercase text-center tracking-[0.4em]">
                CuraMind Message Triage Record
              </p>
            </footer>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-200">
            <MessageSquare size={48} />
          </div>
        )}
      </main>
    </div>
  );
}
