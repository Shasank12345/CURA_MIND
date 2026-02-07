import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Activity, MessageSquare, Download, FileText, AlertCircle, CheckCircle, LogOut } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// --- PDF GENERATION UTILITIES ---
const downloadTriageReport = (s) => {
  const doc = new jsPDF();
  doc.setFont("helvetica", "bold");
  doc.text("AI TRIAGE ASSESSMENT REPORT", 105, 20, { align: "center" });
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Report ID: TS-${s.id}`, 15, 35);
  doc.text(`Date: ${s.date}`, 15, 40);
  doc.text(`Status: ${s.result} FLAG`, 15, 45);

  autoTable(doc, {
    startY: 55,
    head: [['SOAP Category', 'Details']],
    body: [
      ['Subjective', s.triage_soap.s],
      ['Objective', s.triage_soap.o],
      ['Assessment', s.triage_soap.a],
      ['Plan', s.triage_soap.p],
    ],
    theme: 'grid',
    headStyles: { fillColor: [16, 185, 129] }, // Green Theme
  });
  doc.save(`Triage_${s.id}.pdf`);
};

const downloadDoctorSummary = (s) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("OFFICIAL CLINICAL SUMMARY", 15, 20);
  
  doc.setFontSize(10);
  doc.text(`Attending Physician: Dr. ${s.doctor_name}`, 15, 35);
  doc.text(`Consultation Date: ${s.date}`, 15, 40);
  
  doc.line(15, 45, 195, 45);
  
  doc.setFontSize(12);
  doc.text("Clinical Notes:", 15, 55);
  const splitText = doc.splitTextToSize(s.clinical_summary, 180);
  doc.text(splitText, 15, 65);
  
  doc.save(`Summary_${s.id}.pdf`);
};

// --- MAIN COMPONENT ---
export default function UserDashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/user/dashboard_unified_history", { 
          credentials: "include" 
        });
        if (response.status === 401) return navigate("/login");
        const data = await response.json();
        setHistory(data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-emerald-600">LOADING SECURE LEDGER...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: ACTIONS */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
            <Shield className="text-emerald-600 mb-4" size={42} />
            <h1 className="text-3xl font-black text-slate-900 leading-tight">PATIENT<br/>DASHBOARD</h1>
            <div className="mt-8 space-y-3">
              <Link to="/userpannel/chatbot" className="flex items-center justify-between bg-emerald-600 text-white p-5 rounded-2xl font-black hover:bg-emerald-700 transition">
                <span>NEW TRIAGE</span>
                <Activity size={20} />
              </Link>
              <Link to="/userpannel/Avaibledoctorlist" className="flex items-center justify-between bg-slate-900 text-white p-5 rounded-2xl font-black hover:bg-black transition">
                <span>CONSULT DOCTOR</span>
                <MessageSquare size={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: HISTORY */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-6 px-4">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Medical History</h2>
            <span className="text-[10px] bg-slate-200 px-3 py-1 rounded-full font-bold">{history.length} SESSIONS</span>
          </div>

          <div className="space-y-4">
            {history.map((s) => (
              <div key={s.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-emerald-200 transition-colors">
                <div className="flex items-center gap-5">
                  <div className={`p-4 rounded-2xl ${s.result === 'RED' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {s.result === 'RED' ? <AlertCircle size={28} /> : <CheckCircle size={28} />}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">{s.date}</p>
                    <h3 className={`text-lg font-black ${s.result === 'RED' ? 'text-red-600' : 'text-slate-800'}`}>{s.result} FLAG ASSESSMENT</h3>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => downloadTriageReport(s)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-100 text-slate-600 px-5 py-3 rounded-xl text-[10px] font-black hover:bg-slate-200 transition"
                  >
                    <FileText size={16} /> TRIAGE DATA
                  </button>
                  {s.clinical_summary && (
                    <button 
                      onClick={() => downloadDoctorSummary(s)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-xl text-[10px] font-black hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition"
                    >
                      <Download size={16} /> SUMMARY
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}