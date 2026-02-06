import { useEffect, useRef, useState } from "react";
import { 
  Send, Plus, Activity, AlertCircle, 
  ChevronRight, CheckCircle, PhoneCall, ShieldAlert 
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

  // --- STATE ---
  const [chats, setChats] = useState([
    { id: Date.now(), title: "New Consultation", messages: [], status: "active", flag: null }
  ]);
  const [activeChatId, setActiveChatId] = useState(chats[0].id);
  const [input, setInput] = useState("");
  const [currentMeta, setCurrentMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [emergencyData, setEmergencyData] = useState(null);

  const activeChat = chats.find((c) => c.id === activeChatId);

  // --- INITIAL TRIGGER ---
  useEffect(() => {
    if (activeChat && activeChat.messages.length === 0 && !loading && !hasInitialized.current) {
      hasInitialized.current = true;
      handleSendMessage(""); 
    }
  }, [activeChatId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  // --- CORE LOGIC ---
  const handleSendMessage = async (textOverride = null) => {
    if (loading) return; 

    const messageText = textOverride !== null ? textOverride : input;
    
    // Prevent empty sends after the first question is loaded
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

      // Update Meta for the next question
      setCurrentMeta(data);

      if (data.status === "complete") {
        // SAVE TRIAGE ID IN SESSION STORAGE
        if (data.triage_id) {
            sessionStorage.setItem("active_triage_id", data.triage_id);
        }

        setChats(prev => prev.map(c => 
          c.id === activeChatId ? { ...c, status: "complete", flag: data.flag } : c
        ));

        if (data.flag === "RED") {
          // RED = High Risk Injury. Emergency Modal.
          setEmergencyData(data.content);
          setShowEmergency(true);
        } 
        else if (data.flag === "YELLOW") {
          // YELLOW = Pediatric or Specialist Required. Redirect to Doctors.
          toast.warning("Specialist intervention required. Finding available doctors...");
          setTimeout(() => {
            navigate(`/userpannel/Aviabledoctorlist?specialty=Orthopedics&triage_id=${data.triage_id}`);
          }, 2500);
        } 
        else {
          // GREEN = Low Risk.
          updateActiveChat({ sender: "bot", text: data.reply });
          toast.success("Assessment Complete: Low Risk.");
          setTimeout(() => navigate("/userpannel"), 2500);
        }
      } else {
        // Normal question flow
        updateActiveChat({ sender: "bot", text: data.reply });
      }

    } catch (err) {
      updateActiveChat({ sender: "bot", text: "System Error. Please check your connection." });
      toast.error("Failed to reach medical server.");
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
      
      {/* EMERGENCY MODAL (Primarily for RED Flags) */}
      {showEmergency && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] max-w-md w-full p-8 shadow-2xl border-4 border-red-500 text-center animate-in zoom-in duration-300">
            <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <ShieldAlert size={48} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 uppercase mb-2">
              {activeChat?.flag === "RED" ? "Urgent X-Ray Required" : "Clinical Review Needed"}
            </h2>
            <p className="text-slate-600 mb-8 font-medium">
              {emergencyData?.text || "The automated triage indicates a high-risk factor. Immediate physical examination is advised."}
            </p>

            <div className="space-y-3">
              {emergencyData?.emergency_numbers?.map((n, idx) => (
                <a key={idx} href={`tel:${n.number}`} className="flex items-center justify-between bg-red-600 hover:bg-red-700 text-white p-5 rounded-2xl transition-all active:scale-95 group">
                   <div className="flex items-center gap-4">
                    <PhoneCall size={24} />
                    <div className="text-left">
                      <p className="text-[10px] uppercase font-bold opacity-70">{n.label}</p>
                      <p className="text-xl font-black">{n.number}</p>
                    </div>
                  </div>
                  <ChevronRight />
                </a>
              ))}
            </div>

            <button onClick={() => navigate("/userpannel")} className="mt-8 text-slate-400 font-bold hover:text-slate-600 uppercase text-xs tracking-widest">
              Return to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* MAIN LAYOUT */}
      <main className="flex-1 flex flex-col relative bg-white">
        <header className="h-16 border-b flex items-center px-8 justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                    <Activity size={18} />
                </div>
                <h2 className="font-bold text-slate-700 uppercase tracking-widest text-xs">CuraMind AI Triage</h2>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Analyzing Live
            </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-slate-50/50">
          <div className="max-w-3xl mx-auto p-6 space-y-6">
            {activeChat?.messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`p-4 rounded-2xl max-w-[85%] text-sm shadow-sm ${
                  m.sender === "user" ? "bg-emerald-600 text-white" : "bg-white border border-slate-200 text-slate-700"
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            
            {/* OPTION BUTTONS */}
            {currentMeta && activeChat?.status === "active" && !loading && (
              <div className="max-w-md bg-white border border-emerald-100 rounded-3xl p-6 shadow-xl space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-[10px] uppercase tracking-widest">
                  <AlertCircle size={14} /> Clinical Response Needed
                </div>
                
                {currentMeta.helper && (
                  <p className="text-slate-500 text-xs leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                    {currentMeta.helper}
                  </p>
                )}

                <div className="flex gap-3">
                  <button 
                    disabled={loading}
                    onClick={() => handleSendMessage("Yes")} 
                    className="flex-1 bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-all shadow-md disabled:opacity-50 active:scale-95"
                  >YES</button>
                  <button 
                    disabled={loading}
                    onClick={() => handleSendMessage("No")} 
                    className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-xl hover:bg-slate-200 transition-all disabled:opacity-50 active:scale-95"
                  >NO</button>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        <footer className="p-6 bg-white border-t">
          <div className="max-w-3xl mx-auto flex gap-3">
            <input 
              disabled={true} 
              value={input} 
              onChange={e => setInput(e.target.value)}
              placeholder="Please use the clinical options provided above..."
              className="flex-1 p-4 rounded-xl border border-slate-200 bg-slate-50 outline-none text-sm italic"
            />
            <button disabled={true} className="p-4 bg-slate-200 text-white rounded-xl">
              <Send size={20} />
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}