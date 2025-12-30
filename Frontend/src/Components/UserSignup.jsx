import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const countries = [
  { code: "NP", dial: "+977", flag: "🇳🇵", regex: /^9[78]\d{8}$/ },
  { code: "IN", dial: "+91", flag: "🇮🇳", regex: /^[6-9]\d{9}$/ },
  { code: "US", dial: "+1", flag: "🇺🇸", regex: /^\d{10}$/ },
  { code: "UK", dial: "+44", flag: "🇬🇧", regex: /^7\d{9}$/ },
];

export default function UserSignup() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [country, setCountry] = useState("NP");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");

  const handleSignup = async () => {
    const selectedCountry = countries.find((c) => c.code === country);

    // Validation
    if (!fullName.trim()) return toast.error("Enter full name");
    if (!email || emailError) return toast.error("Enter valid email");
    if (!phone) return setPhoneError("Phone number is required");
    if (!selectedCountry.regex.test(phone)) return setPhoneError(`Invalid format for ${selectedCountry.code}`);
    if (!address.trim()) return toast.error("Enter address");
    if (!dob) return toast.error("Select date of birth");

    // Unified Data Format: FormData
    const formData = new FormData();
    formData.append("Full_Name", fullName);
    formData.append("Email", email);
    formData.append("Phone_Number", `${selectedCountry.dial}${phone}`);
    formData.append("Country", country);
    formData.append("Address", address);
    formData.append("DOB", dob);
    formData.append("role", "User");

    try {
      const res = await fetch("http://localhost:5000/auth/sign_up", {
        method: "POST",
        // Note: No 'Content-Type' header here. 
        // Browser sets multipart/form-data boundary automatically.
        body: formData,
      });

      const data = await res.json();

      if (res.status === 201) {
        toast.success("Signup successful. Check email for temporary password.");
        navigate("/Login");
      } else if (res.status === 409) {
        toast.error("Email already exists");
      } else {
        toast.error(data.error || "Signup failed");
      }
    } catch {
      toast.error("Server error");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-blue-700">Sign Up</h1>

        <div className="space-y-4 mt-6">
          <div>
            <label className="font-semibold text-sm">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="font-semibold text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                const v = e.target.value;
                setEmail(v);
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                setEmailError(regex.test(v) ? "" : "Invalid email format");
              }}
              className={`w-full p-3 border rounded-lg ${emailError ? "border-red-500" : ""}`}
            />
            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
          </div>

          <div>
            <label className="font-semibold text-sm">Phone Number</label>
            <div className="flex gap-2">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="p-3 border rounded-lg w-32 text-sm bg-gray-50"
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.dial}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                className="flex-1 p-3 border rounded-lg"
                placeholder="Number"
              />
            </div>
            {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
          </div>

          <div>
            <label className="font-semibold text-sm">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="font-semibold text-sm">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <button
            onClick={handleSignup}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}