import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  const validatePassword = (value) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!regex.test(value)) {
      setPasswordError(
        "Password must have 1 uppercase, 1 lowercase, numbers, 1 symbol, and min 8 characters"
      );
    } else {
      setPasswordError("");
    }
  };

  const handleSignup = () => {
    if (!email || emailError) {
      alert("Please enter a valid email");
      return;
    }
    if (!password || passwordError) {
      alert("Please enter a valid password");
      return;
    }
    if (!phone || phoneError) {
      alert("Please enter a valid phone number");
      return;
    }
    
    navigate("/");{
      
    }
   
  };

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('/src/assets/fi.jpg')` }}
    >
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center">Sign Up as User</h1>

        <div className="space-y-2 text-sm">
          <div>
            <label className="font-semibold">Full Name</label>
            <input
              type="text"
              
              placeholder="Enter your Full Name"
              className="w-full p-3 border border-black rounded-lg text-sm"
            />
          </div>
          
          <div>
            <label className="font-semibold">Email</label>
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
            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
          </div>

          <div className="relative text-sm">
            <label className="font-semibold">Password</label>
            <input
            
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              placeholder="Enter your Password"
              className={`w-full p-4 border rounded-lg text-sm ${
                passwordError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-black focus:ring-indigo-500"
              }`}
            />
            {/* Password Toggle */}
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 top-9 text-gray-600 hover:text-black"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {passwordError && (
              <p className="text-red-500 text-xs mt-1">{passwordError}</p>
            )}
          </div>

          <div>
            <label className="font-semibold">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => {
                const value = e.target.value;
                setPhone(value);

                if (!/^\d*$/.test(value)) {
                  setPhoneError("Enter numbers only");
                  return;
                }
                if (value.length > 10) {
                  setPhoneError("Enter a valid 10-digit number");
                  return;
                }
                if (value.length > 0 && value.length < 10) {
                  setPhoneError("Phone number must be 10 digits");
                  return;
                }
                setPhoneError("");
              }}
              placeholder="Enter your Phone number"
              className={`w-full p-3 border rounded-lg text-sm ${
                phoneError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-black focus:ring-indigo-500"
              }`}
            />
            {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
          </div>
          <div>
            <label className="font-semibold">Address</label>
            <input
              type="text"
              
              placeholder="Enter your Address"
              className="w-full p-3 border border-black rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="font-semibold">DOB</label>
            <input
           
              type="date"
              className="w-full p-3 border border-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="button"
            onClick={handleSignup}
            className="mt-4 w-full bg-indigo-600 text-white p-3 rounded-md font-bold text-sm hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
