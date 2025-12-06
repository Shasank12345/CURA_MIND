import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div className="relative min-h-screen w-full">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/src/assets/fi.jpg')" }}
      ></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="bg-white bg-opacity-90 shadow-md rounded-lg max-w-lg w-full p-10 flex flex-col space-y-4">

          {/* Logo */}
          <div className="mb-6">
            <div className="w-36 h-14 rounded-xl bg-indigo-500 flex items-center justify-start px-5 text-black font-bold text-lg">
              CuraMind Logo
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-2 text-center">Welcome Back!</h1>
          <p className="text-gray-500 font-bold mb-6 text-center">
            Where smart technology meets smart health.
          </p>

          <form className="w-full space-y-5">
           
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  setEmailError(
                    !regex.test(e.target.value)
                      ? "Please enter a valid email address"
                      : ""
                  );
                }}
                placeholder="Enter your email address"
                className={`w-full p-3 border rounded-lg text-sm ${
                  emailError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-black focus:ring-indigo-500"
                }`}
              />
              {emailError && (
                <p className="text-red-500 text-xs mt-1">{emailError}</p>
              )}
            </div>

            <div className="relative text-sm">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full p-4 border border-black rounded-lg text-sm   focus:ring-indigo-500"
              />

              {/* Toggle icon */}
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-4 top-4 text-gray-600 hover:text-black"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            
            <div className="text-right -mt-2">
              <button
                type="button"
                onClick={() => navigate("/ForgotPassword")}
                className="text-indigo-600 text-sm font-semibold hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
            >
              Log in
            </button>
          </form>

          {/* Sign Up Dropdown */}
          <div className="mt-8 text-center text-lg text-gray-500">
            Don’t have an account?{" "}
            <div className="relative inline-block group">
              <span className="text-indigo-600 font-medium cursor-pointer hover:underline">
                Register here
              </span>

              <div
                className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-white border border-black
                           rounded-lg shadow-md p-2 space-y-1 opacity-0 invisible
                           group-hover:opacity-100 group-hover:visible transition-all duration-200"
              >
                <div
                  onClick={() => navigate("/DoctorSignup")}
                  className="w-full py-1 px-2 text-left rounded-md border border-black
                             hover:bg-indigo-50 cursor-pointer text-sm transition font-semibold"
                >
                  👨‍⚕️ Sign up as Doctor
                </div>

                <div
                  onClick={() => navigate("/UserSignup")}
                  className="w-full py-1 px-2 text-left rounded-md border border-black 
                             hover:bg-indigo-50 cursor-pointer text-sm transition font-semibold"
                >
                  👤 Sign up as User
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
