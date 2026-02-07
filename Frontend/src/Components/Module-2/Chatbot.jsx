import { useEffect, useRef, useState } from "react";
import {
  Send,
  Activity,
  AlertCircle,
  ChevronRight,
  PhoneCall,
  ShieldAlert
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { toast } from "react-toastify";

const API_BASE = "http://127.0.0.1:5000";

export default function Chatbot() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  const hasInitialized = useRef(false);

  const [chats, setChats] = useState([
    {
      id: crypto.randomUUID(),
      title: "New Consultation",
      messages: [],
      status: "active",
      flag: null
    }
  ]);

  const [activeChatId] = useState(chats[0].id);
  const [input, setInput] = useState("");
  const [currentMeta, setCurrentMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [emergencyData, setEmergencyData] = useState(null);

  const activeChat = chats.find(c => c.id === activeChatId);

  useEffect(() => {
    if (!hasInitialized.current && user?.id) {
      hasInitialized.current = true;
      handleSendMessage("START_TRIAGE");
    }
  }, [user?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages, loading]);

  const updateActiveChat = msg => {
    setChats(prev =>
      prev.map(chat =>
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, msg] }
          : chat
      )
    );
  };

  const handleSendMessage = async (textOverride = null) => {
    if (loading) return;

    if (currentMeta && textOverride === null) return;

    const messageText = textOverride ?? input;
    if (!messageText) return;

    setLoading(true);

    if (messageText !== "START_TRIAGE") {
      updateActiveChat({ sender: "user", text: messageText });
    }

    try {
      const res = await fetch(`${API_BASE}/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          acc_id: user.id,
          message: messageText
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setCurrentMeta(data);

      if (data.status === "complete") {
        sessionStorage.setItem("active_triage_id", data.triage_id);

        setChats(prev =>
          prev.map(c =>
            c.id === activeChatId
              ? { ...c, status: "complete", flag: data.flag }
              : c
          )
        );

        if (data.flag === "RED") {
          setEmergencyData(data.content);
          setShowEmergency(true);
          return;
        }

        toast.success(`Assessment complete. Flag: ${data.flag}`);

        setTimeout(() => {
          navigate(
            `/userpannel/Avaibledoctorlist?specialty=${
              data.flag === "YELLOW" ? "Orthopedics" : "General"
            }&triage_id=${data.triage_id}`
          );
        }, 1200);
      } else {
        updateActiveChat({ sender: "bot", text: data.reply });
      }
    } catch (err) {
      updateActiveChat({
        sender: "bot",
        text: "Backend unreachable or server error."
      });
      toast.error("Server error");
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      {showEmergency && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border-4 border-red-600">
            <div className="mx-auto mb-4 w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
              <ShieldAlert className="text-red-600" size={30} />
            </div>

            <h2 className="font-extrabold uppercase text-lg text-red-700">
              Emergency Detected
            </h2>

            <p className="text-sm text-slate-600 mt-3">
              {emergencyData?.text}
            </p>

            <div className="mt-6 space-y-3">
              {emergencyData?.emergency_numbers?.map((n, i) => (
                <a
                  key={i}
                  href={`tel:${n.number}`}
                  className="flex items-center justify-between bg-red-600 text-white px-5 py-4 rounded-xl font-bold"
                >
                  <span className="flex items-center gap-2">
                    <PhoneCall size={18} /> {n.number}
                  </span>
                  <ChevronRight />
                </a>
              ))}
            </div>

            <button
              onClick={() => setShowEmergency(false)}
              className="mt-6 text-xs uppercase underline text-slate-400"
            >
              Return
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col bg-white">
        <header className="h-16 border-b px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-emerald-600" />
            <span className="font-bold uppercase text-xs tracking-wider">
              CuraMind AI
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold text-emerald-600">
            Live Triage
          </span>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto space-y-4">
            {activeChat.messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-3 max-w-[75%] text-sm ${
                    m.sender === "user"
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="bg-slate-100 text-xs px-4 py-2 rounded-xl animate-pulse w-fit">
                Analyzing symptoms...
              </div>
            )}

            {currentMeta && activeChat.status === "active" && !loading && (
              <div className="bg-white border rounded-2xl p-5 shadow space-y-4 max-w-sm">
                <div className="flex items-center gap-2 text-xs uppercase font-bold text-emerald-700">
                  <AlertCircle size={14} /> Action Required
                </div>

                {currentMeta.helper && (
                  <p className="text-xs italic text-slate-500">
                    {currentMeta.helper}
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleSendMessage("Yes")}
                    className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold"
                  >
                    YES
                  </button>
                  <button
                    onClick={() => handleSendMessage("No")}
                    className="flex-1 bg-slate-200 py-3 rounded-xl font-bold"
                  >
                    NO
                  </button>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </div>

        <footer className="border-t p-6">
          <div className="max-w-2xl mx-auto flex gap-3">
            <input
              readOnly
              placeholder="Use buttons above"
              className="flex-1 p-4 rounded-xl border bg-slate-50 italic text-sm cursor-not-allowed"
            />
            <button disabled className="bg-slate-200 p-4 rounded-xl">
              <Send />
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}
