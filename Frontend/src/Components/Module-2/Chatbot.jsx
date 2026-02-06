import { useEffect, useRef, useState } from "react";
import { 
  Send, Activity, AlertCircle, 
  ChevronRight, PhoneCall, ShieldAlert 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx"; 
import { toast } from "react-toastify";

const API_BASE = "http://127.0.0.1:5000";

export default function Chatbot() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const hasInitialized = useRef(false);
  const chatEndRef = useRef(null);

  const [chats, setChats] = useState([
    { id: Date.now(), title: "New Consultation", messages: [], status: "active", flag: null }
  ]);
  const [activeChatId] = useState(chats[0].id);
  const [input, setInput] = useState("");
  const [currentMeta, setCurrentMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [emergencyData, setEmergencyData] = useState(null);

  const activeChat = chats.find((c) => c.id === activeChatId);

  useEffect(() => {
    if (!hasInitialized.current && user?.id) {
      hasInitialized.current = true;
      handleSendMessage(""); 
    }
  }, [user?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  const handleSendMessage = async (textOverride = null) => {
    if (loading) return; 

    const messageText = textOverride !== null ? textOverride : input;
    if (messageText === "" && activeChat?.messages.length > 0) return;
    
    setLoading(true);
    if (messageText !== "") {
      updateActiveChat({ sender: "user", text: messageText });
    }

    try {
      const response = await fetch(`${API_BASE}/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            acc_id: user?.id, 
            message: messageText 
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Server error");

      setCurrentMeta(data);

      if (data.status === "complete") {
        // SAVING TRIAGE ID
        if (data.triage_id) {
            sessionStorage.setItem("active_triage_id", data.triage_id);
        }

        setChats(prev => prev.map(c => 
          c.id === activeChatId ? { ...c, status: "complete", flag: data.flag } : c
        ));

        if (data.flag === "RED") {
          setEmergencyData(data.content);
          setShowEmergency(true);
        } 
        else {
          const specialty = data.flag === "YELLOW" ? "Orthopedics" : "General";
          toast.info(`Assessment Complete. Redirecting...`);
          
          // CRITICAL: Matches path in your App.js exactly
          setTimeout(() => {
            navigate(`/userpannel/Avaibledoctorlist?specialty=${specialty}&triage_id=${data.triage_id}`);
          }, 1500);
        }
      } else {
        updateActiveChat({ sender: "bot", text: data.reply });
      }

    } catch (err) {
      updateActiveChat({ sender: "bot", text: "Connection error." });
      toast.error("Network failure.");
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const updateActiveChat = (msg) => {
    setChats(prev => prev.map(chat =>
      chat.id === activeChatId ? { ...chat, messages: [...chat.messages, msg] } : chat
    ));
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      
      {showEmergency && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] max-w-md w-full p-8 shadow-2xl border-4 border-red-500 text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldAlert size={32} className="text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2 uppercase">Emergency Protocol</h2>
            <p className="text-slate-600 mb-6 text-sm">
              {emergencyData?.text || "High-risk factors detected."}
            </p>

            <div className="space-y-3">
              {emergencyData?.emergency_numbers?.map((n, idx) => (
                <a key={idx} href={`tel:${n.number}`} className="flex items-center justify-between bg-red-600 text-white p-4 rounded-xl hover:bg-red-700">
                  <div className="flex items-center gap-3 font-bold">
                    <PhoneCall size={20} /> {n.number}
                  </div>
                  <ChevronRight size={18} />
                </a>
              ))}
            </div>
            <button onClick={() => navigate("/userpannel")} className="mt-6 text-slate-400 font-bold text-xs uppercase">
              Exit
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col bg-white">
        <header className="h-16 border-b flex items-center px-8 justify-between">
            <div className="flex items-center gap-2">
                <Activity size={18} className="text-emerald-600" />
                <h2 className="font-bold text-slate-700 text-sm uppercase tracking-tight">CuraMind AI</h2>
            </div>
            <span className="text-[10px] font-bold text-emerald-500 uppercase">Live Analysis</span>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="max-w-2xl mx-auto space-y-4">
            {activeChat?.messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`p-4 rounded-2xl max-w-[80%] text-sm ${
                  m.sender === "user" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700"
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            
            {currentMeta && activeChat?.status === "active" && !loading && (
              <div className="max-w-sm bg-white border border-emerald-100 rounded-2xl p-5 shadow-xl space-y-4 animate-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-[10px] uppercase">
                  <AlertCircle size={14} /> Response Required
                </div>
                {currentMeta.helper && <p className="text-slate-500 text-xs italic">{currentMeta.helper}</p>}
                <div className="flex gap-2">
                  <button onClick={() => handleSendMessage("Yes")} className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700">YES</button>
                  <button onClick={() => handleSendMessage("No")} className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200">NO</button>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        <footer className="p-6 border-t">
          <div className="max-w-2xl mx-auto flex gap-3">
            <input disabled className="flex-1 p-4 rounded-xl border bg-slate-50 text-sm italic" placeholder="Use buttons to respond..." />
            <button disabled className="p-4 bg-slate-200 text-white rounded-xl"><Send size={20} /></button>
          </div>
        </footer>
      </main>
    </div>
  );
}