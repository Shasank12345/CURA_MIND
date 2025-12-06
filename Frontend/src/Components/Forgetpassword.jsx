import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!email) return toast.error("Enter your email");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/auth/forgot_password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email }),
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        toast.success(data.message);
        navigate("/otp", { state: { email } });
      } else {
        toast.error(data.error || "Failed to send OTP");
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage: "url('/src/assets/fi.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-3xl shadow-lg max-w-md w-full space-y-6">
        {/* Navbar-style logo */}
        <div className="flex items-center justify-center gap-2 text-2xl font-semibold">
          <span className="text-green-600 text-3xl">🍃</span>
          <span className="tracking-wide text-gray-800">CuraMind</span>
        </div>

        <p className="text-gray-600 text-center text-lg">Forgot Password</p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
        />

        <button
          onClick={handleSendOTP}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </div>
    </div>
  );
}
