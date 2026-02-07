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

const specializations = [
  "General Practitioner",
  "Orthopedics",
  "Sports Medicine Specialist",
  "Physiotherapist"
];

export default function DoctorSignup() {
  const navigate = useNavigate();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("NP");
  const [phone, setPhone] = useState("");
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
      return;
    }
    setLicensePhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSignup = async () => {
    const selectedCountry = countries.find((c) => c.code === country);
    
    // Validation
    if (!fullname.trim()) return toast.error("Enter full name");
    if (!email.includes("@")) return toast.error("Enter valid email");
    if (!phone || !selectedCountry.regex.test(phone)) return toast.error("Invalid phone format");
    if (!spec) return toast.error("Select your specialization");
    if (!license.trim()) return toast.error("Enter license number");
    if (!dob) return toast.error("Select date of birth");
    if (!licensePhoto) return toast.error("Upload license photo");

    const fullPhoneNumber = `${selectedCountry.dial}${phone}`;

    // DATA KEYS MUST MATCH BACKEND EXACTLY
    const formData = new FormData();
    formData.append("Full_Name", fullname);
    formData.append("Email", email);
    formData.append("Phone_Number", fullPhoneNumber);
    formData.append("Specialization", spec); // Matches backend data.get('Specialization')
    formData.append("License_No", license);   // Matches backend data.get('License_No')
    formData.append("DOB", dob);
    formData.append("bio_summary", bio);
    formData.append("hospital_name", hospital);
    formData.append("role", "Doctor");
    formData.append("License_Img", licensePhoto); // Matches backend request.files['License_Img']

    try {
      const res = await fetch("http://localhost:5000/auth/sign_up", {
        method: "POST",
        body: formData, // Browser sets Content-Type to multipart/form-data automatically
      });

      const data = await res.json();
      if (res.status === 201) {
        toast.success("Registration submitted for Admin review.");
        navigate("/Login");
      } else {
        toast.error(data.error || "Signup failed");
      }
    } catch (err) {
      toast.error("Connection to server failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-2xl border border-gray-100">
        <h1 className="text-3xl font-black text-center mb-8 text-indigo-900 uppercase tracking-tight">Doctor Registration</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="text-xs font-black text-gray-400 uppercase mb-2 block">Full Name</label>
            <input type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="Dr. Jane Doe" />
          </div>

          <div>
            <label className="text-xs font-black text-gray-400 uppercase mb-2 block">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-gray-50 border-none rounded-xl" placeholder="jane@hospital.com" />
          </div>

          <div>
            <label className="text-xs font-black text-gray-400 uppercase mb-2 block">Mobile Number</label>
            <div className="flex gap-2">
              <select value={country} onChange={(e) => setCountry(e.target.value)} className="p-3 bg-gray-50 border-none rounded-xl text-sm">
                {countries.map(c => <option key={c.code} value={c.code}>{c.flag} {c.dial}</option>)}
              </select>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} className="flex-1 p-3 bg-gray-50 border-none rounded-xl" placeholder="98XXXXXXXX" />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-gray-400 uppercase mb-2 block">Primary Specialty</label>
            <select value={spec} onChange={(e) => setSpec(e.target.value)} className="w-full p-3 bg-gray-50 border-none rounded-xl">
              <option value="">Select...</option>
              {specializations.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-black text-gray-400 uppercase mb-2 block">Medical License ID</label>
            <input type="text" value={license} onChange={(e) => setLicense(e.target.value)} className="w-full p-3 bg-gray-50 border-none rounded-xl font-mono" />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-black text-gray-400 uppercase mb-2 block">Affiliated Hospital</label>
            <input type="text" value={hospital} onChange={(e) => setHospital(e.target.value)} className="w-full p-3 bg-gray-50 border-none rounded-xl" placeholder="Medical Center Name" />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-black text-gray-400 uppercase mb-2 block">Professional Summary</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-3 bg-gray-50 border-none rounded-xl h-24 resize-none" placeholder="Briefly describe your clinical background..."></textarea>
          </div>

          <div>
            <label className="text-xs font-black text-gray-400 uppercase mb-2 block">Date of Birth</label>
            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full p-3 bg-gray-50 border-none rounded-xl" />
          </div>

          <div>
            <label className="text-xs font-black text-gray-400 uppercase mb-2 block">License Document</label>
            <input type="file" accept="image/*" onChange={handleLicensePhoto} className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
            {preview && <img src={preview} alt="Preview" className="mt-4 h-20 w-auto rounded-lg shadow-sm" />}
          </div>
        </div>

        <button onClick={handleSignup} className="w-full mt-10 bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95">
          Submit Application
        </button>
      </div>
    </div>
  );
}