import { useState } from "react";

export default function RejectOption() {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  return (
    <div className="flex flex-col gap-5 w-full max-w-sm mx-auto p-6 bg-white rounded-2xl shadow-xl border border-red-100">
      <h3 className="text-lg font-semibold text-gray-800 text-center">
        Rejection Details
      </h3>


      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">
          Rejection Reason
        </label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm bg-gray-50 focus:ring-2 focus:ring-red-400 focus:border-red-400 focus:outline-none transition"
        >
          <option value="">Select a reason</option>
          <option value="blurry">Uploaded file is blurry</option>
          <option value="mismatch">License mismatch</option>
          <option value="incomplete">Incomplete details</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">
          Additional Explanation
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add additional details (optional)"
          rows={4}
          className="border-2 border-red-200 rounded-xl px-3 py-2 w-full text-sm bg-red-50 placeholder-red-300 resize-none
                     focus:ring-2 focus:ring-red-400 focus:border-red-500 focus:bg-white
                     transition shadow-inner"
        />
      </div>
      <button
        className="bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold w-full py-2.5 rounded-xl
                   shadow-md hover:from-red-600 hover:to-red-700 hover:shadow-lg
                   focus:ring-2 focus:ring-red-400 focus:outline-none transition"
        onClick={() => {
          console.log({ reason, note });
        }}
      >
        Reject Request
      </button>
    </div>
  );
}
