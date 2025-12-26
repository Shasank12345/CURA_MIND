import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DoctorSignup() {
  const navigate = useNavigate();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [spec, setSpec] = useState("");
  const [license, setLicense] = useState("");
  const [dob, setDob] = useState("");

  const [licensePhoto, setLicensePhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  // 📸 Handle license photo
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
    if (!fullname) return toast.error("Please enter your full name");
    if (!email || emailError) return toast.error("Please enter a valid email");
    if (!phone || phoneError) return toast.error("Please enter a valid phone number");
    if (!spec) return toast.error("Please enter your specialization");
    if (!license) return toast.error("Please enter your license number");
    if (!dob) return toast.error("Please select your date of birth");
    if (!licensePhoto) return toast.error("Please upload license photo (max 200KB)");

    const formData = new FormData();
    formData.append("Full_Name", fullname);
    formData.append("Email", email);
    formData.append("Phone_Number", phone);
    formData.append("Spec", spec);
    formData.append("License_no", license);
    formData.append("DOB", dob);
    formData.append("role", "Doctor");
    formData.append("licenseImage", licensePhoto);

    try {
      const res = await fetch("http://localhost:5000/auth/sign_up", {
        method: "POST",
        body: formData, // ✅ multipart/form-data
      });

      const data = await res.json();

      if (res.status === 201) {
        toast.success("Signup successful! Temp password sent to email.");
        navigate("/Login");
      } else if (res.status === 409) {
        toast.error("Email already exists.");
      } else {
        toast.error(data.error || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: `url('/src/assets/fi.jpg')` }}
    >
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center">Sign Up as Doctor</h1>
        <p className="text-gray-500 font-semibold text-center mb-4 text-sm mt-2">
          Fill out your information to be signed up.
        </p>

        <div className="space-y-3 text-sm">
          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="w-full p-3 border border-black rounded-lg"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              setEmailError(!regex.test(e.target.value) ? "Invalid email" : "");
            }}
            className={`w-full p-3 border rounded-lg ${emailError ? "border-red-500" : "border-black"}`}
          />

          {/* Phone */}
          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => {
              const v = e.target.value;
              setPhone(v);
              setPhoneError(v.length !== 10 ? "Phone must be 10 digits" : "");
            }}
            className={`w-full p-3 border rounded-lg ${phoneError ? "border-red-500" : "border-black"}`}
          />

          {/* Specialization */}
          <input
            type="text"
            placeholder="Specialization"
            value={spec}
            onChange={(e) => setSpec(e.target.value)}
            className="w-full p-3 border border-black rounded-lg"
          />

          {/* License No */}
          <input
            type="text"
            placeholder="License Number"
            value={license}
            onChange={(e) => setLicense(e.target.value)}
            className="w-full p-3 border border-black rounded-lg"
          />

          {/* DOB */}
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full p-3 border border-black rounded-lg"
          />

          {/* 🆕 License Photo */}
          <div>
            <label className="font-semibold">License Photo </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLicensePhoto}
              className="w-full p-2 border border-black rounded-lg"
            />

            {preview && (
              <img
                src={preview}
                alt="License Preview"
                className="mt-2 w-full h-40 object-contain border rounded-lg"
              />
            )}
          </div>
        </div>

        <button
          onClick={handleSignup}
          className="mt-4 w-full bg-indigo-600 text-white p-3 rounded-md font-bold hover:bg-blue-700"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}