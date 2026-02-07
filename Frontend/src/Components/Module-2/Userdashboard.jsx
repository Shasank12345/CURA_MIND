import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Activity, Download, FileText, AlertCircle, CheckCircle, ChevronRight } from "lucide-react";
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
    headStyles: { fillColor: [16, 185, 129] },
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

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
      <Activity className="text-emerald-500 animate-pulse mb-4" size={48} />
      <span className="font-bold text-slate-400 tracking-tighter uppercase">Initializing Ledger</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="lg:col-span-3">
          <div className="sticky top-12 space-y-8">
            <div>
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-200">
                <Shield className="text-white" size={24} />
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
                Patient<br/><span className="text-emerald-600">Portal.</span>
              </h1>
            </div>

            <Link 
              to="/userpannel/chatbot" 
              className="group flex items-center justify-between bg-slate-900 text-white p-5 rounded-2xl font-bold hover:bg-emerald-600 transition-all duration-300 shadow-xl shadow-slate-200"
            >
              <div className="flex flex-col">
                <span className="text-[10px] opacity-60 uppercase tracking-widest">Action</span>
                <span>Start New Triage</span>
              </div>
              <Activity className="group-hover:rotate-12 transition-transform" size={20} />
            </Link>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="lg:col-span-9">
          <div className="flex items-end justify-between mb-8 border-b border-slate-200 pb-6">
            <div>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Activity History</h2>
              <p className="text-slate-900 font-medium">Review your clinical assessments</p>
            </div>
            <div className="bg-emerald-50 text-emerald-700 px-4 py-1 rounded-full text-xs font-bold border border-emerald-100">
              {history.length} Sessions Total
            </div>
          </div>

          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-20 text-center">
                <p className="text-slate-400 font-medium">No medical history found.</p>
              </div>
            ) : (
              history.map((s) => (
                <div 
                  key={s.id} 
                  className="group bg-white p-5 rounded-[1.5rem] border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      s.result === 'RED' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'
                    }`}>
                      {s.result === 'RED' ? <AlertCircle size={24} /> : <CheckCircle size={24} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          s.result === 'RED' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {s.result} FLAG
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.date}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 tracking-tight">System Assessment Report</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => downloadTriageReport(s)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-50 text-slate-600 px-4 py-3 rounded-xl text-[11px] font-bold hover:bg-slate-100 transition border border-slate-200"
                    >
                      <FileText size={14} /> DATA
                    </button>
                    {s.clinical_summary && (
                      <button 
                        onClick={() => downloadDoctorSummary(s)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-xl text-[11px] font-bold hover:bg-emerald-700 hover:-translate-y-0.5 transition-all shadow-sm"
                      >
                        <Download size={14} /> SUMMARY
                      </button>
                    )}
                    <ChevronRight className="hidden md:block text-slate-300 group-hover:translate-x-1 transition-transform" size={20} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}