import React, { useState, useEffect } from "react";
import { Clock, Download, AlertCircle, CheckCircle, FileText, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const downloadClinicalReport = (session) => {
  try {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("CURAMIND CLINICAL ASSESSMENT", 105, 15, { align: "center" });
    
    doc.setFontSize(10);
    doc.text(`Session ID: #TS-${session.id}`, 15, 25);
    doc.text(`Date: ${session.date}`, 15, 30);
    doc.text(`Triage Result: ${session.result} FLAG`, 15, 35);

    autoTable(doc, {
      startY: 45,
      head: [['Clinical Category', 'Findings']],
      body: [
        ['Subjective (S)', session.soap?.s || "Initial triage data only."],
        ['Objective (O)', session.soap?.o || "Physical symptoms recorded via bot."],
        ['Assessment (A)', session.soap?.a || `Patient flagged as ${session.result}.`],
        ['Plan (P)', session.soap?.p || "Recommended R.I.C.E and clinical review."]
      ],
      theme: 'grid',
      headStyles: { fillColor: [30, 41, 59] },
      styles: { fontSize: 10, cellPadding: 4 }
    });

    doc.save(`CuraMind_Report_${session.id}.pdf`);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    alert("Could not generate PDF. Please check console.");
  }
};

export default function UserDashboard() {
  const [history, setHistory] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncData = async () => {
      try {
        const [pRes, hRes] = await Promise.all([
          fetch("http://localhost:5000/user/profile", { credentials: "include" }),
          fetch("http://localhost:5000/user/triage_history", { credentials: "include" })
        ]);

        if (pRes.ok) setProfile(await pRes.json());
        if (hRes.ok) setHistory(await hRes.json());
      } catch (err) {
        console.error("Dashboard Sync Failed:", err);
      } finally {
        setLoading(false);
      }
    };
    syncData();
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-400 font-bold tracking-widest text-xs">
      SYNCING RECORDS...
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      
      {/* 1. WELCOME SECTION */}
      <div>
        <h2 className="text-3xl font-black text-slate-800">Health Dashboard</h2>
        <p className="text-slate-500 font-medium">Welcome back, {profile?.full_name?.split(' ')[0]}.</p>
      </div>

      {/* 2. ACTION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/userpannel/chatbot" className="bg-emerald-600 p-8 rounded-2xl flex items-center justify-between group transition hover:bg-emerald-700 shadow-sm">
          <div>
            <h3 className="text-white font-black text-xl">START TRIAGE</h3>
            <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider mt-1 underline">New Assessment</p>
          </div>
          <FileText className="text-white/40 group-hover:text-white transition-colors" size={40} />
        </Link>

        <Link to="/userpannel/onetoonechat" className="bg-slate-800 p-8 rounded-2xl flex items-center justify-between group transition hover:bg-slate-900 shadow-sm">
          <div>
            <h3 className="text-white font-black text-xl">CONSULT DOCTOR</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1 underline">Chat with Specialist</p>
          </div>
          <MessageSquare className="text-white/40 group-hover:text-white transition-colors" size={40} />
        </Link>
      </div>

      {/* 3. HISTORY SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
          <Clock size={16} className="text-slate-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Clinical History</span>
        </div>

        <div className="divide-y divide-slate-100">
          {history.length === 0 ? (
            <div className="p-16 text-center text-slate-400 text-sm font-medium italic">
              No previous triage sessions found.
            </div>
          ) : (
            history.map((s) => (
              <div key={s.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  {/* Date Block */}
                  <div className="text-center min-w-[70px]">
                    <p className="text-sm font-black text-slate-800">{s.date.split(' ')[0]}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{s.date.split(' ')[1]}</p>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-3">
                    {s.result === 'RED' ? 
                      <AlertCircle className="text-red-500" size={24} /> : 
                      <CheckCircle className="text-emerald-500" size={24} />
                    }
                    <div>
                      <p className={`text-xs font-black uppercase tracking-widest ${s.result === 'RED' ? 'text-red-600' : 'text-emerald-600'}`}>
                        {s.result} FLAG
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold">Session #TS-{s.id}</p>
                    </div>
                  </div>
                </div>

                {/* PDF Button */}
                <button 
                  onClick={() => downloadClinicalReport(s)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-black hover:bg-emerald-600 transition-all shadow-sm"
                >
                  <Download size={14} /> PDF REPORT
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}