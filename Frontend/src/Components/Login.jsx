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
        // First-time login check
        if (data.requires_password_update) {
          toast.info("Security check: Update your temporary password.");
          navigate("/newpassword", { replace: true });
          return;
        }

        // --- PERSISTENCE LOGIC START ---
        // This solves the SESSION ERROR in OneToOneChat.jsx 
        // by mirroring the backend structure into localStorage
        const authData = {
          user: data.user, // Contains { id: ... }
          role: data.role
        };
        localStorage.setItem("user", JSON.stringify(authData));
        // --- PERSISTENCE LOGIC END ---

        // Updating Context State
        setUser(data.user);
        setRole(data.role);
        sessionStorage.setItem("user_role", data.role);

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
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-8 py-4 bg-white/90 backdrop-blur-md shadow-md z-50">
        <div
          className="flex items-center gap-2 text-xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span className="text-green-600 text-3xl">🍃</span>
          <span className="tracking-wide text-gray-900 text-2xl">CuraMind</span>
        </div>

        <div className="flex items-center gap-4 relative">
          <button
            onClick={() => navigate("/Login")}
            className="text-gray-700 font-medium hover:text-green-700 transition"
          >
            Login
          </button>

          {/* Signup dropdown */}
          <div className="relative group inline-block">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow-md font-semibold transition">
              Signup
            </button>

            <div
              className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-white border border-gray-300
                            rounded-xl shadow-lg p-2 space-y-2 opacity-0 invisible
                            group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
            >
              <div
                onClick={() => navigate("/DoctorSignup")}
                className="w-full py-2 px-3 text-left rounded-lg border border-gray-black
                           hover:bg-green-50 cursor-pointer text-sm font-medium transition"
              >
                👨‍⚕️ Sign up as Doctor
              </div>

              <div
                onClick={() => navigate("/UserSignup")}
                className="w-full py-2 px-3 text-left rounded-lg border border-gray-black
                           hover:bg-green-50 cursor-pointer text-sm font-medium transition"
              >
                👤 Sign up as User
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="absolute inset-0 bg-black opacity-20"></div>

      <div className="relative bg-white bg-opacity-95 p-8 rounded-3xl shadow-2xl max-w-md w-full space-y-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-3xl font-bold text-gray-800">
            <span className="text-emerald-500"><Activity size={32} /></span>
            <span className="tracking-tight">CuraMind</span>
          </div>
          <p className="text-gray-500 text-center font-medium text-sm">
            Intelligent Triage & Healthcare Management
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1 tracking-wider">
              Email Address
            </label>
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
              className={`w-full p-3 border rounded-xl text-sm transition focus:ring-2 focus:ring-emerald-400 outline-none font-semibold ${
                emailError ? "border-red-500" : "border-gray-200"
              }`}
            />
            {emailError && (
              <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold uppercase tracking-tighter">
                {emailError}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1 tracking-wider">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl text-sm transition focus:ring-2 focus:ring-emerald-400 outline-none font-semibold"
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 top-8 text-gray-400 hover:text-emerald-600 transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/ForgotPassword")}
              className="text-xs font-black text-emerald-600 hover:text-emerald-800 transition uppercase tracking-tighter"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 text-white rounded-xl font-black text-sm shadow-lg hover:bg-emerald-700 active:scale-95 transition disabled:bg-gray-400 uppercase tracking-widest"
          >
            {loading ? "AUTHENTICATING..." : "SIGN IN"}
          </button>
        </form>

        <div className="pt-4 border-t border-gray-100">
          <p className="text-center text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">
            New to CuraMind?
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/UserSignup")}
              className="flex items-center justify-center gap-2 p-3 border-2 border-emerald-50 border-gray-100 rounded-xl text-xs font-black hover:bg-emerald-50 hover:border-emerald-200 transition text-slate-700"
            >
              <UserIcon size={14} /> PATIENT
            </button>
            <button
              onClick={() => navigate("/DoctorSignup")}
              className="flex items-center justify-center gap-2 p-3 border-2 border-emerald-50 border-gray-100 rounded-xl text-xs font-black hover:bg-emerald-50 hover:border-emerald-200 transition text-slate-700"
            >
              👨‍⚕️ DOCTOR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}