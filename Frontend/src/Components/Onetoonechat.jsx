import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, User, Stethoscope, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

export default function OneToOneChat() {
  const location = useLocation();
  const navigate = useNavigate();
  const { consultationId } = location.state || {};
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef();
  
  // MATCHING YOUR BACKEND LOGIC:
  // Your login returns: { "role": "...", "user": {"id": ...} }
  const rawUser = localStorage.getItem("user");
  const userData = rawUser ? JSON.parse(rawUser) : {};
  
  // Extracting based on your specific backend structure
  const myId = userData.user?.id ? Number(userData.user.id) : 0; 
  const myRole = (userData.role || "").toLowerCase();

  useEffect(() => {
    if (!consultationId || myId === 0) {
      console.error("Auth Data Missing:", { myId, myRole, userData });
      toast.error("Session Error: Please Log In Again");
      navigate('/');
    }
  }, [consultationId, myId, navigate]);

  // POLLING
  useEffect(() => {
    if (!consultationId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:5000/otochat/messages/${consultationId}`, {
          credentials: "include"
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
        }
      } catch (err) { console.error("Poll error"); }
    };

    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [consultationId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const res = await fetch(`http://localhost:5000/otochat/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consultationId, content: newMessage }),
        credentials: "include"
      });
      if (res.ok) setNewMessage("");
    } catch (err) { toast.error("Send failed"); }
  };

  return (
    <div className="flex flex-col h-[90vh] bg-white border-4 border-emerald-600 rounded-2xl shadow-2xl overflow-hidden m-2">
      <div className="bg-emerald-600 p-4 text-white flex justify-between items-center">
        <button onClick={() => navigate(-1)}><ArrowLeft size={24} /></button>
        <h1 className="font-black uppercase italic">Consultation #{consultationId}</h1>
        <div className="bg-white text-emerald-700 px-3 py-1 rounded text-[10px] font-black uppercase">
          {myRole || "NO ROLE"}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => {
          const senderId = Number(msg.sender_id);
          const isMe = senderId === myId;
          
          let label = "STRANGER";
          if (isMe) {
            label = "YOU";
          } else if (myRole === 'doctor') {
            label = "PATIENT";
          } else if (myRole === 'user' || myRole === 'patient') {
            label = "DOCTOR";
          }

          return (
            <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                <span className="text-[9px] font-black mb-1 px-2 text-slate-500 uppercase">
                  {label}
                </span>
                <div className={`p-3 rounded-xl font-bold text-sm shadow-sm ${
                  isMe ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none border'
                }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 bg-slate-50 border-t-2 flex gap-2">
        <input 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="TYPE MESSAGE..."
          className="flex-1 border-2 rounded-xl px-4 py-2 font-bold outline-none focus:border-emerald-500"
        />
        <button className="bg-emerald-600 text-white px-6 rounded-xl font-black uppercase hover:bg-emerald-700 transition-all">
          Send
        </button>
      </form>
    </div>
  );
}