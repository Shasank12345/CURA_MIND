import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function NewPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleReset = async () => {
    if (!password || !confirm) return toast.error("Fill all fields");
    if (password !== confirm) return toast.error("Passwords do not match");

    try {
      const res = await fetch("http://localhost:5000/auth/change_password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ NewPassword: password }),
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Password changed successfully!");
        setTimeout(() => navigate("/Login"), 1500);
      } else {
        toast.error(data.error || "Failed to change password");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: `url('/src/assets/fi.jpg')` }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-3xl shadow-lg max-w-md w-full space-y-4">
        <h1 className="text-3xl font-bold text-center text-blue-700">CuraMind</h1>
        <p className="text-gray-600 text-center mb-4">Create New Password</p>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-black-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full p-3 border border-black-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
        />

        <button
          onClick={handleReset}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}
