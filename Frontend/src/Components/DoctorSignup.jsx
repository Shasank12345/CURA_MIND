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

export default function DoctorSignup() {
  const navigate = useNavigate();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [country, setCountry] = useState("NP");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [spec, setSpec] = useState("");
  const [license, setLicense] = useState("");
  const [dob, setDob] = useState("");
  const [licensePhoto, setLicensePhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleLicensePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 200 * 1024) {
      toast.error("License photo must be less than 200 KB");
      e.target.value = "";
      return;
    }

    setLicensePhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSignup = async () => {
    const selectedCountry = countries.find((c) => c.code === country);

    // Strict Validation
    if (!fullname.trim()) return toast.error("Enter full name");
    if (!email || emailError) return toast.error("Enter valid email");
    
    if (!phone) {
      setPhoneError("Phone number is required");
      return;
    }
    if (!selectedCountry.regex.test(phone)) {
      setPhoneError(`Invalid format for ${selectedCountry.code}`);
      return;
    }

    if (!spec.trim()) return toast.error("Enter specialization");
    if (!license.trim()) return toast.error("Enter license number");
    if (!dob) return toast.error("Select date of birth");
    if (!licensePhoto) return toast.error("Upload license photo");

    // Constructing E.164 compatible number
    const fullPhoneNumber = `${selectedCountry.dial}${phone}`;

    const formData = new FormData();
    formData.append("Full_Name", fullname);
    formData.append("Email", email);
    formData.append("Phone_Number", fullPhoneNumber);
    formData.append("Country", country);
    formData.append("Spec", spec);
    formData.append("License_no", license);
    formData.append("DOB", dob);
    formData.append("role", "Doctor");
    formData.append("licenseImage", licensePhoto);

    try {
      const res = await fetch("http://localhost:5000/auth/sign_up", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.status === 201) {
        toast.success("Signup successful. Temp password sent to email.");
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
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-4 text-indigo-700">Sign Up as Doctor</h1>

        <div className="space-y-4">
          <div>
            <label className="font-semibold text-sm">Full Name</label>
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-indigo-500"
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
                setEmailError(regex.test(v) ? "" : "Invalid email");
              }}
              className={`w-full p-2 border rounded-lg ${emailError ? "border-red-500" : ""}`}
            />
            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
          </div>

          <div>
            <label className="font-semibold text-sm">Phone Number</label>
            <div className="flex gap-2">
              <select
                value={country}
                onChange={(e) => {
                    setCountry(e.target.value);
                    setPhoneError("");
                }}
                className="p-2 border rounded-lg w-32 text-sm"
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
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setPhone(val);
                  setPhoneError("");
                }}
                className={`flex-1 p-2 border rounded-lg ${phoneError ? "border-red-500" : ""}`}
                placeholder="Phone number"
              />
            </div>
            {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-sm">Specialization</label>
              <input
                type="text"
                value={spec}
                onChange={(e) => setSpec(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="font-semibold text-sm">License Number</label>
              <input
                type="text"
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-sm">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="font-semibold text-sm">License Photo (Max 200KB)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLicensePhoto}
              className="w-full p-1 text-sm border rounded-lg"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 h-24 object-contain border rounded-lg"
              />
            )}
          </div>

          <button
            onClick={handleSignup}
            className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}