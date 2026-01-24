import { useEffect, useState } from "react";
import { FileText, ShieldCheck, Activity, User, Hash } from "lucide-react";

const API_BASE = "http://127.0.0.1:5000";

export default function User1() {
  const [history, setHistory] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/admin/triage-history`)
      .then(res => res.json())
      .then(data => {
        setHistory(data);
        setLoading(false);
        if (data.length > 0) handleSelect(data[0].session_id);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSelect = (id) => {
    setSelectedId(id);
    fetch(`${API_BASE}/admin/triage-detail/${id}`)
      .then(res => res.json())
      .then(json => setDetail(json))
      .catch(err => console.error("Detail Error:", err));
  };

  if (loading) return <div className="p-10 font-bold text-green-600 animate-pulse">Loading Records...</div>;

  return (
    <div className="flex h-[calc(100vh-60px)] bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm m-4">
      
      {/* SIDEBAR: Minimalist List */}
      <aside className="w-72 border-r border-gray-100 flex flex-col bg-gray-50">
        <div className="p-5 border-b border-gray-200 bg-white">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <Activity size={14} /> Records
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {history.map(item => (
            <div 
              key={item.session_id}
              onClick={() => handleSelect(item.session_id)}
              className={`px-5 py-4 cursor-pointer border-b border-gray-100 transition-colors ${
                selectedId === item.session_id 
                ? 'bg-white border-l-4 border-l-green-600' 
                : 'hover:bg-gray-100'
              }`}
            >
              <p className={`text-sm font-semibold ${selectedId === item.session_id ? 'text-green-700' : 'text-gray-700'}`}>
                {item.patient_name}
              </p>
              <p className="text-[10px] text-gray-400 mt-1 uppercase">ID: {item.acc_id}</p>
            </div>
          ))}
        </div>
      </aside>

      {/* DETAIL VIEW: Clean Paper Aesthetic */}
      <main className="flex-1 bg-white overflow-y-auto">
        {detail ? (
          <div className="max-w-3xl mx-auto py-12 px-8">
            
            {/* Header */}
            <header className="mb-10 border-b border-gray-100 pb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{detail.patient_info.name}</h1>
                    <div className="flex gap-5 mt-2">
                        <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
                            <User size={12}/> DOB: {detail.patient_info.dob}
                        </span>
                        <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
                            <Hash size={12}/> REF: {detail.patient_info.acc_id}
                        </span>
                    </div>
                </div>
                <div className="text-green-600 bg-green-50 p-3 rounded-lg">
                    <ShieldCheck size={24} />
                </div>
            </header>

            {/* SOAP Section */}
            <div className="space-y-8">
              {[
                { label: 'Subjective', key: 's' },
                { label: 'Objective', key: 'o' },
                { label: 'Assessment', key: 'a' },
                { label: 'Plan', key: 'p' }
              ].map(section => (
                <section key={section.key} className="grid grid-cols-4 gap-4">
                  <div className="col-span-1">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                        {section.label}
                    </span>
                  </div>
                  <div className="col-span-3">
                    <p className="text-gray-700 text-sm leading-relaxed border-l-2 border-gray-100 pl-4">
                      {detail.soap[section.key] || "No data recorded."}
                    </p>
                  </div>
                </section>
              ))}
            </div>

            <footer className="mt-20 pt-8 border-t border-gray-100">
                <p className="text-[9px] text-gray-300 font-bold uppercase text-center tracking-[0.4em]">
                    CuraMind Official Medical Record
                </p>
            </footer>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-200">
            <FileText size={48} />
          </div>
        )}
      </main>
    </div>
  );
}