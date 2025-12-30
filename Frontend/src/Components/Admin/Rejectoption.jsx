import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function RejectOption({ doctorId, onComplete, onCancel }) {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRejectAction = async () => {
    // Basic validation
    if (!reason) {
      toast.warning("Please select a reason for rejection.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Hits the admin handle_request endpoint
      const response = await axios.post(
        `http://localhost:5000/admin/handle_request/${doctorId}`, 
        { 
          action: 'reject',
          reason: reason,
          note: note 
        }, 
        { withCredentials: true }
      );
      
      if (response.status === 200) {
        toast.error("Application rejected and notification sent.");
        onComplete(); // Closes modal and navigates away
      }
    } catch (err) {
      console.error("Rejection Error:", err);
      toast.error(err.response?.data?.error || "Server error during rejection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full p-8 bg-white rounded-3xl shadow-2xl">
      <div className="text-center">
        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
          Rejection Review
        </h3>
        <p className="text-xs text-gray-400 font-semibold mt-1">
          The doctor will be notified via email
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
          Primary Reason
        </label>
        <select
          value={reason}
          disabled={isSubmitting}
          onChange={(e) => setReason(e.target.value)}
          className="border-2 border-gray-100 rounded-xl px-4 py-3 w-full text-sm font-medium bg-gray-50 focus:bg-white focus:border-red-400 outline-none transition-all disabled:opacity-50 appearance-none"
        >
          <option value="">Choose a reason...</option>
          <option value="Uploaded file is blurry">Uploaded file is blurry</option>
          <option value="License mismatch">License mismatch / Expired</option>
          <option value="Incomplete details">Incomplete details</option>
          <option value="Invalid credentials">Invalid credentials</option>
          <option value="Other">Other (Specify in notes)</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
          Internal Note / Detailed Explanation
        </label>
        <textarea
          value={note}
          disabled={isSubmitting}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Explain exactly what was wrong..."
          rows={4}
          className="border-2 border-gray-100 rounded-2xl px-4 py-3 w-full text-sm bg-gray-50 focus:bg-white focus:border-red-400 outline-none transition-all resize-none disabled:opacity-50"
        />
      </div>

      <div className="flex flex-col gap-3 mt-4">
        <button
          onClick={handleRejectAction}
          disabled={isSubmitting}
          className="w-full bg-red-600 text-white text-sm font-black py-4 rounded-2xl shadow-lg shadow-red-200 hover:bg-red-700 active:scale-95 transition-all disabled:bg-gray-300 disabled:shadow-none"
        >
          {isSubmitting ? "Processing..." : "Confirm Rejection"}
        </button>
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className="w-full bg-transparent text-gray-400 text-xs font-bold py-2 hover:text-gray-600 transition"
        >
          Cancel and Return
        </button>
      </div>
    </div>
  );
}