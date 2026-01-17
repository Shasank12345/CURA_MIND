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

// Must match your triage.py logic exactly
const specializations = [
  "General Practitioner",
  "Orthopedist",
  "Sports Medicine Specialist",
  "Physiotherapist"
];

export default function DoctorSignup() {
  const navigate = useNavigate();

  // State Management
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [country, setCountry] = useState("NP");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [spec, setSpec] = useState("");
  const [license, setLicense] = useState("");
  const [dob, setDob] = useState("");
  const [bio, setBio] = useState("");
  const [hospital, setHospital] = useState("");
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

    // Strict Validations
    if (!fullname.trim()) return toast.error("Enter full name");
    if (!email || emailError) return toast.error("Enter valid email");
    if (!phone || !selectedCountry.regex.test(phone)) {
      setPhoneError("Invalid phone format");
      return;
    }
    if (!spec) return toast.error("Select your specialization");
    if (!license.trim()) return toast.error("Enter license number");
    if (!dob) return toast.error("Select date of birth");
    if (bio.length < 50) return toast.error("Bio must be at least 50 characters");
    if (!licensePhoto) return toast.error("Upload license photo");

    const fullPhoneNumber = `${selectedCountry.dial}${phone}`;

    const formData = new FormData();
    formData.append("Full_Name", fullname);
    formData.append("Email", email);
    formData.append("Phone_Number", fullPhoneNumber);
    formData.append("Spec", spec);
    formData.append("License_no", license);
    formData.append("DOB", dob);
    formData.append("bio_summary", bio);
    formData.append("hospital_name", hospital);
    formData.append("role", "Doctor");
    formData.append("licenseImage", licensePhoto);

    try {
      const res = await fetch("http://localhost:5000/auth/sign_up", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.status === 201) {
        toast.success("Signup successful! Waiting for admin approval.");
        navigate("/Login");
      } else {
        toast.error(data.error || "Signup failed");
      }
    } catch {
      toast.error("Server connection failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">Medical Practitioner Signup</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-1">Full Name</label>
            <input type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} className="w-full p-2 border rounded-md" placeholder="Dr. John Doe" />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full p-2 border rounded-md ${emailError ? 'border-red-500' : ''}`} />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-bold mb-1">Phone Number</label>
            <div className="flex gap-1">
              <select value={country} onChange={(e) => setCountry(e.target.value)} className="p-2 border rounded-md bg-gray-50 text-xs">
                {countries.map(c => <option key={c.code} value={c.code}>{c.flag} {c.dial}</option>)}
              </select>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} className="flex-1 p-2 border rounded-md" placeholder="98XXXXXXXX" />
            </div>
          </div>

          {/* Specialization Dropdown */}
          <div>
            <label className="block text-sm font-bold mb-1">Specialization</label>
            <select value={spec} onChange={(e) => setSpec(e.target.value)} className="w-full p-2 border rounded-md">
              <option value="">Select Specialty</option>
              {specializations.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* License Number */}
          <div>
            <label className="block text-sm font-bold mb-1">License Number</label>
            <input type="text" value={license} onChange={(e) => setLicense(e.target.value)} className="w-full p-2 border rounded-md" />
          </div>

          {/* Hospital Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-1">Hospital / Clinic Affiliation</label>
            <input type="text" value={hospital} onChange={(e) => setHospital(e.target.value)} className="w-full p-2 border rounded-md" placeholder="e.g. Kathmandu Medical Center" />
          </div>

          {/* Bio Summary */}
          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-1">Professional Bio (Clinical Summary)</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-2 border rounded-md h-24" placeholder="Describe your experience with trauma, surgery, or general practice..."></textarea>
          </div>

          {/* DOB */}
          <div>
            <label className="block text-sm font-bold mb-1">Date of Birth</label>
            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full p-2 border rounded-md" />
          </div>

          {/* License Upload */}
          <div>
            <label className="block text-sm font-bold mb-1">License Photo (Max 200KB)</label>
            <input type="file" accept="image/*" onChange={handleLicensePhoto} className="w-full text-xs" />
            {preview && <img src={preview} alt="Preview" className="mt-2 h-16 w-auto rounded border" />}
          </div>
        </div>

        <button onClick={handleSignup} className="w-full mt-6 bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition duration-200">
          SUBMIT REGISTRATION
        </button>
      </div>
    </div>
  );
}