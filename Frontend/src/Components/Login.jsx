import React, { useState } from "react";
import { Eye, EyeOff, User as UserIcon, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext.jsx"; 

export default function Login() {
  const navigate = useNavigate();
  const { setUser, setRole } = useAuth();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!email || emailError) return toast.error("Please enter a valid email");
    if (!password) return toast.error("Please enter your password");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, Password: password }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        setRole(data.role);
        sessionStorage.setItem("user_role", data.role);
        if (data.first_login) {
          toast.info("Security check: Update your temporary password.");
          navigate("/newpassword");
          return;
        }

        toast.success(`Welcome back, ${data.role}!`);
        const routes = {
          "Admin": "/adminpannel",
          "Doctor": "/doctordashboard",
          "User": "/userpannel"
        };
        navigate(routes[data.role] || "/userpannel");

      } else {
        toast.error(data.error || "Login failed. Please check credentials.");
      }
    } catch (err) {
      console.error("Login Fetch Error:", err);
      toast.error("Server connection failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 bg-cover bg-center p-4"
      style={{ backgroundImage: `url('/src/assets/fi.jpg')` }}
    >
      {/* Overlay for better readability if background is busy */}
      <div className="absolute inset-0 bg-black opacity-20"></div>

      <div className="relative bg-white bg-opacity-95 p-8 rounded-3xl shadow-2xl max-w-md w-full space-y-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-3xl font-bold text-gray-800">
            <span className="text-green-500"><Activity size={32} /></span>
            <span className="tracking-tight">CuraMind</span>
          </div>
          <p className="text-gray-500 text-center font-medium text-sm">
            Intelligent Triage & Healthcare Management
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => {
                const val = e.target.value;
                setEmail(val);
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                setEmailError(!regex.test(val) ? "Invalid email format" : "");
              }}
              className={`w-full p-3 border rounded-xl text-sm transition focus:ring-2 focus:ring-indigo-400 outline-none ${
                emailError ? "border-red-500" : "border-gray-200"
              }`}
            />
            {emailError && <p className="text-red-500 text-[10px] mt-1 ml-1 font-semibold">{emailError}</p>}
          </div>

          {/* Password Field */}
          <div className="relative">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl text-sm transition focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 top-8 text-gray-400 hover:text-indigo-600 transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/ForgotPassword")}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-indigo-700 active:scale-95 transition disabled:bg-gray-400"
          >
            {loading ? "AUTHENTICATING..." : "SIGN IN"}
          </button>
        </form>

        <div className="pt-4 border-t border-gray-100">
          <p className="text-center text-gray-500 text-xs font-bold uppercase tracking-wider">
            New to CuraMind?
          </p>
          
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/UserSignup")}
              className="flex items-center justify-center gap-2 p-2 border border-gray-200 rounded-lg text-xs font-bold hover:bg-gray-50 transition"
            >
              <UserIcon size={14} /> PATIENT
            </button>
            <button
              onClick={() => navigate("/DoctorSignup")}
              className="flex items-center justify-center gap-2 p-2 border border-gray-200 rounded-lg text-xs font-bold hover:bg-gray-50 transition"
            >
              👨‍⚕️ DOCTOR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}