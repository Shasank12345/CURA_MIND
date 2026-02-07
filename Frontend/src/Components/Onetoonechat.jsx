import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Power, ClipboardList, User } from 'lucide-react';
import { toast } from 'react-toastify';

const API_BASE = "http://localhost:5000";

export default function OneToOneChat() {
  const location = useLocation();
  const navigate = useNavigate();
  const { consultationId } = location.state || {};
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isClosed, setIsClosed] = useState(false); 
  const [showSummary, setShowSummary] = useState(false); 
  const [summaryText, setSummaryText] = useState("");
  const scrollRef = useRef();
  
  // Robust User Parsing
  const rawUser = localStorage.getItem("user");
  const userData = rawUser ? JSON.parse(rawUser) : null;
  const myId = userData?.user?.id ? Number(userData.user.id) : 0; 
  const myRole = (userData?.role || "").toLowerCase();
  const isDoctor = myRole === 'doctor';

  // 1. Kick out if no session
  useEffect(() => {
    if (!consultationId || myId === 0) {
      toast.error("Invalid Session. Redirecting...");
      navigate(isDoctor ? '/doctordashboard' : '/userpannel/Avaibledoctorlist');
    }
  }, [consultationId, myId, navigate, isDoctor]);

  // 2. Polling Logic
  useEffect(() => {
    if (!consultationId || isClosed) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_BASE}/otochat/messages/${consultationId}`, {
          credentials: "include"
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
          if (data.status === 'completed') {
            setIsClosed(true);
          }
        }
      } catch (err) { console.error("Poll failed. Check server connection."); }
    };

    const interval = setInterval(fetchMessages, 2500);
    return () => clearInterval(interval);
  }, [consultationId, isClosed]);

  // 3. Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isClosed) return;

    try {
      const res = await fetch(`${API_BASE}/otochat/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consultationId, content: newMessage }),
        credentials: "include"
      });
      if (res.ok) {
        setNewMessage("");
      } else {
        const errData = await res.json();
        toast.error(errData.error || "Failed to send");
      }
    } catch (err) { toast.error("Connection lost"); }
  };

  const handleEndConsultation = async () => {
    if (!summaryText.trim()) return toast.warning("Summary notes are required.");
    try {
      const res = await fetch(`${API_BASE}/otochat/end`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consultationId, summary: summaryText }),
        credentials: "include"
      });
      if (res.ok) {
        toast.success("Consultation finalized.");
        navigate('/doctordashboard');
      }
    } catch (err) { toast.error("Error ending session"); }
  };

  return (
    <div className="flex flex-col h-[92vh] bg-slate-50 border-4 border-emerald-600 rounded-3xl shadow-2xl overflow-hidden m-2">
      {/* Header */}
      <div className="bg-emerald-600 p-4 text-white flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="hover:bg-emerald-700 p-1 rounded-full"><ArrowLeft size={24} /></button>
          <div>
            <h1 className="font-black text-sm uppercase italic tracking-wider leading-none">Live Chat</h1>
            <p className="text-[10px] font-bold opacity-80 uppercase">ID: #{consultationId}</p>
          </div>
        </div>
        {isDoctor && !isClosed && (
          <button onClick={() => setShowSummary(true)} className="bg-white text-red-600 px-4 py-2 rounded-xl font-black text-xs flex items-center gap-2 hover:scale-105 transition-all shadow-lg">
            <Power size={14} /> COMPLETE SESSION
          </button>
        )}
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20">
            <User size={48} />
            <p className="font-black italic uppercase text-sm mt-2">Connecting to secure line...</p>
          </div>
        )}
        {messages.map((msg) => {
          const isMe = Number(msg.sender_id) === myId;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-3 rounded-2xl shadow-sm border-2 ${
                isMe ? 'bg-emerald-600 border-emerald-700 text-white rounded-tr-none' : 'bg-white border-slate-200 text-slate-800 rounded-tl-none'
              }`}>
                <p className="text-sm font-bold leading-relaxed">{msg.content}</p>
                <p className="text-[9px] mt-1 opacity-60 text-right font-black italic">{msg.timestamp}</p>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Footer */}
      <div className="p-4 bg-white border-t-4 border-slate-100">
        {isClosed ? (
          <div className="bg-emerald-50 border-2 border-emerald-500 border-dashed p-4 rounded-2xl text-center">
            <p className="text-emerald-800 font-black uppercase text-xs">Consultation has been archived by the doctor</p>
            <button onClick={() => navigate(-1)} className="mt-2 text-[10px] font-black text-emerald-600 underline uppercase tracking-tighter">Return to panel</button>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="TYPE YOUR MESSAGE..."
              className="flex-1 border-2 border-slate-200 rounded-2xl px-4 py-3 font-bold text-sm outline-none focus:border-emerald-500 bg-slate-50"
            />
            <button className="bg-emerald-600 text-white px-6 rounded-2xl font-black uppercase hover:bg-emerald-700 shadow-lg active:scale-95 transition-all">
              <Send size={18} />
            </button>
          </form>
        )}
      </div>

      {/* Summary Modal (Doctor Only) */}
      {showSummary && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-center z-[999] p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-emerald-600">
            <div className="bg-emerald-600 p-6 text-white text-center">
              <ClipboardList className="mx-auto mb-2" size={32} />
              <h2 className="font-black uppercase text-xl italic">Clinical Summary</h2>
              <p className="text-[10px] font-bold opacity-80">This note will be saved to the patient's permanent record.</p>
            </div>
            <div className="p-8">
              <textarea 
                className="w-full h-44 border-2 border-slate-100 rounded-2xl p-4 font-bold text-sm focus:border-emerald-600 outline-none resize-none bg-slate-50"
                placeholder="Prescriptions, diagnosis, and follow-up steps..."
                value={summaryText}
                onChange={(e) => setSummaryText(e.target.value)}
              />
              <div className="flex flex-col gap-3 mt-6">
                <button onClick={handleEndConsultation} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase hover:bg-emerald-700 shadow-xl">Complete & Close Session</button>
                <button onClick={() => setShowSummary(false)} className="w-full text-slate-400 font-black text-xs uppercase tracking-widest py-2">Go Back</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}