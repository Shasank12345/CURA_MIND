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

    if (!fullName || !email || !address || !dob) return toast.error("All fields are required");
    if (!selectedCountry.regex.test(phone)) return toast.error("Invalid phone format");

    // DATA SENT AS JSON OBJECT
    const payload = {
      full_name: fullName,
      email: email,
      phone_number: `${selectedCountry.dial}${phone}`,
      address: address, // Lowercase key
      dob: dob,         // Lowercase key
      role: "User"
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md space-y-4">
        <h2 className="text-2xl font-black text-blue-600 text-center uppercase tracking-tight">Create Account</h2>
        <input type="text" placeholder="Full Name" className="w-full p-3 border rounded-xl" onChange={e => setFullName(e.target.value)} />
        <input type="email" placeholder="Email Address" className="w-full p-3 border rounded-xl" onChange={e => setEmail(e.target.value)} />
        <div className="flex gap-2">
            <select className="border rounded-xl p-3 bg-slate-50" onChange={e => setCountry(e.target.value)}>
                {countries.map(c => <option key={c.code} value={c.code}>{c.flag} {c.dial}</option>)}
            </select>
            <input type="text" placeholder="Phone" className="flex-1 p-3 border rounded-xl" onChange={e => setPhone(e.target.value)} />
        </div>
        <input type="text" placeholder="Physical Address" className="w-full p-3 border rounded-xl" onChange={e => setAddress(e.target.value)} />
        <input type="date" className="w-full p-3 border rounded-xl" onChange={e => setDob(e.target.value)} />
        <button onClick={handleSignup} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200">SIGN UP</button>
      </div>
    </div>
  );
}