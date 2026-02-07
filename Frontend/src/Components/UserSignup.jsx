import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const countries = [
  { code: "NP", dial: "+977", flag: "🇳🇵", regex: /^9[78]\d{8}$/ },
  { code: "IN", dial: "+91", flag: "🇮🇳", regex: /^[6-9]\d{9}$/ },
];

export default function UserSignup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [country, setCountry] = useState("NP");

  const handleSignup = async () => {
    const selectedCountry = countries.find((c) => c.code === country);

    if (!fullName || !email || !address || !dob)
      return toast.error("All fields are required");
    if (!selectedCountry.regex.test(phone))
      return toast.error("Invalid phone format");

    const payload = {
      full_name: fullName,
      email: email,
      phone_number: `${selectedCountry.dial}${phone}`,
      address: address,
      dob: dob,
      role: "User",
    };

    try {
      const res = await fetch("http://localhost:5000/auth/sign_up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Signup success! Check email.");
        navigate("/Login");
      } else {
        toast.error(data.error || "Signup failed");
      }
    } catch (err) {
      toast.error("Connection error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50"
     style={{ backgroundImage: `url('/src/assets/fi.jpg')` }}
    >
     

      {/* ✅ NAVBAR ADDED */}
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-8 py-5 bg-white/90 backdrop-blur-md shadow-md z-50">
        <div
          className="flex items-center gap-2 text-xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span className="text-green-600 text-3xl">🍃</span>
          <span className="tracking-wide text-gray-900 text-2xl">
            CuraMind
          </span>
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

      {/* ✅ Signup Form (Same as Yours) */}
      <div className="min-h-screen flex items-center justify-center p-6 pt-32">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md space-y-4">
          <h2 className="text-2xl font-black text-blue-600 text-center uppercase tracking-tight">
            Create Account
          </h2>

          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border rounded-xl"
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 border rounded-xl"
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="flex gap-2">
            <select
              className="border rounded-xl p-3 bg-slate-50"
              onChange={(e) => setCountry(e.target.value)}
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.dial}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Phone"
              className="flex-1 p-3 border rounded-xl"
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <input
            type="text"
            placeholder="Physical Address"
            className="w-full p-3 border rounded-xl"
            onChange={(e) => setAddress(e.target.value)}
          />

          <input
            type="date"
            className="w-full p-3 border rounded-xl"
            onChange={(e) => setDob(e.target.value)}
          />

          <button
            onClick={handleSignup}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200"
          >
            SIGN UP
          </button>
        </div>
      </div>
    </div>
  );
}
