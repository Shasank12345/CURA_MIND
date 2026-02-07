import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, Clock } from "lucide-react";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:5000";

export default function WaitingRoom() {
  const location = useLocation();
  const navigate = useNavigate();
  const { consultationId } = location.state || {};
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    if (!consultationId) {
      toast.error("No active session found.");
      navigate("/userpannel/Avaibledoctorlist");
      return;
    }

    localStorage.setItem("active_consult_id", consultationId);

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${API_BASE}/user/consultation/status/${consultationId}`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error("Server error");

        const data = await res.json();
        const currentStatus = data.status.toLowerCase();
        setStatus(currentStatus);

        if (currentStatus === "accepted" || currentStatus === "in_progress") {
          clearInterval(interval);
          toast.success("Doctor is ready! Entering chat...");
          navigate("/userpannel/onetoonechat", {
            state: { consultationId },
            replace: true
          });
        } 
        else if (currentStatus === "rejected") {
          clearInterval(interval);
          localStorage.removeItem("active_consult_id");
          toast.error("Doctor is unavailable.");
          navigate("/userpannel/Avaibledoctorlist");
        } 
        else if (currentStatus === "completed") {
          clearInterval(interval);
          localStorage.removeItem("active_consult_id");
          toast.info("Consultation ended by doctor.");
          navigate("/userpannel/dashboard", { replace: true });
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [consultationId, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-[2rem] shadow-xl text-center border border-slate-200">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Loader2 size={64} className="text-emerald-500 animate-spin" />
            <Clock size={24} className="absolute inset-0 m-auto text-slate-400" />
          </div>
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">
          Reviewing Your Case
        </h2>
        <p className="text-slate-500 font-medium mb-6">
          The doctor is analyzing your triage notes. Stay on this page.
        </p>
        <div className="inline-block px-4 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold border border-emerald-100 uppercase">
          Status: {status}
        </div>
      </div>
    </div>
  );
}
