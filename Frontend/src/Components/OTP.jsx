import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function OTP() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(120);
  const location = useLocation();
  const email = location.state?.email || "";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (timer <= 0) return;
    const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(countdown);
  }, [timer]);

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) return toast.error("Enter all 6 digits of OTP");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/auth/verify_otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, Otp: code }),
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        toast.success(data.message);
        navigate("/newpassword");
      } else {
        toast.error(data.error || "Invalid OTP");
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
      style={{ backgroundImage: `url('/src/assets/fi.jpg')` }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-3xl shadow-lg max-w-md w-full space-y-4">
        <h1 className="text-3xl font-bold text-center text-blue-700">CuraMind</h1>
        <p className="text-gray-600 text-center mb-2">OTP Verification</p>
        <p className="text-gray-700 text-center mb-4">
          OTP sent to <span className="font-semibold">{email}</span>
        </p>

        <p className="text-right text-red-600 font-medium mb-4">
          Time Left: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
        </p>

        <div className="flex justify-center gap-2 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              className="w-12 h-12 text-center border border-gray-300 rounded-lg text-xl focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
}
