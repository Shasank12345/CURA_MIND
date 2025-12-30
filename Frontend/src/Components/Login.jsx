import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const navigate = useNavigate();
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
        // Essential session data for the frontend
        sessionStorage.setItem("email", data.email);
        sessionStorage.setItem("role", data.role);

        if (data.first_login) {
          toast.info("First login: please change your password");
          navigate("/newpassword");
        } else {
          toast.success("Login successful!");
          
          // Manual Routing Logic since you're not using ProtectedRoute wrappers
          if (data.role === "Admin") {
            navigate("/adminpannel");
          } else if (data.role === "Doctor") {
            navigate("/doctor-dashboard");
          } else {
            navigate("/user-home");
          }
        }
      } else {
        // Handles 401 (Wrong credentials) and 403 (Doctor not verified)
        toast.error(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: `url('/src/assets/fi.jpg')` }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-3xl shadow-lg max-w-md w-full space-y-4">
        <div className="flex items-center justify-center gap-2 text-2xl font-semibold">
          <span className="text-green-600 text-3xl">🍃</span>
          <span className="tracking-wide text-gray-800">CuraMind</span>
        </div>

        <p className="text-gray-600 text-center mt-2 font-semibold text-sm">
          Where smart technology meets smart health
        </p>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                setEmailError(!regex.test(e.target.value) ? "Enter valid email" : "");
              }}
              className={`w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none ${
                emailError ? "border-red-500" : "border-gray-300"
              }`}
            />
            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm outline-none"
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={() => navigate("/ForgotPassword")}
              className="text-blue-600 text-sm hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-2 font-semibold">
          Don’t have an account?{" "}
          <span className="relative group inline-block cursor-pointer text-blue-600 font-semibold hover:underline">
            Signup
            {/* Tooltip Dropdown */}
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-white border border-gray-300 rounded-xl shadow-lg p-2 space-y-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div
                onClick={() => navigate("/UserSignup")}
                className="w-full py-2 px-3 text-left rounded-lg border border-gray-100 hover:bg-blue-50 cursor-pointer text-sm font-medium transition"
              >
                👤 Sign up as User
              </div>
              <div
                onClick={() => navigate("/DoctorSignup")}
                className="w-full py-2 px-3 text-left rounded-lg border border-gray-100 hover:bg-blue-50 cursor-pointer text-sm font-medium transition"
              >
                👨‍⚕️ Sign up as Doctor
              </div>
            </div>
          </span>
        </p>
      </div>
    </div>
  );
}