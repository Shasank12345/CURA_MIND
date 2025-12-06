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

  const handleSignup = async () => {
    if (!fullname) return toast.error("Please enter your full name");
    if (!email || emailError) return toast.error("Please enter a valid email");
    if (!phone || phoneError) return toast.error("Please enter a valid phone number");
    if (!spec) return toast.error("Please enter your specialization");
    if (!license) return toast.error("Please enter your license number");
    if (!dob) return toast.error("Please select your date of birth");

    const payload = {
      Full_Name: fullname,
      Email: email,
      Phone_Number: phone,
      Spec: spec,
      License_no: license,
      DOB: dob,
      role: "Doctor",
    };

    try {
      const res = await fetch("http://localhost:5000/auth/sign_up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.status === 201) {
        toast.success("Signup successful! Temp password sent to email.");
        navigate("/Login");
      } else if (res.status === 409) {
        toast.error("Email already exists. Please use a different email.");
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
          <div>
            <label className="font-semibold">Full Name</label>
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Enter your full name"
              className="w-full p-3 border border-black rounded-lg text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label className="font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                setEmailError(!regex.test(e.target.value) ? "Please enter a valid email address" : "");
              }}
              placeholder="Enter your email address"
              className={`w-full p-3 border rounded-lg text-sm ${emailError ? "border-red-500" : "border-black"}`}
            />
            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
          </div>

          {/* Phone */}
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
              placeholder="Enter your phone number"
              className={`w-full p-3 border rounded-lg text-sm ${phoneError ? "border-red-500" : "border-black"}`}
            />
            {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
          </div>

          {/* Specialization */}
          <div>
            <label className="font-semibold">Area of Specialization</label>
            <input
              type="text"
              value={spec}
              onChange={(e) => setSpec(e.target.value)}
              placeholder="Enter your specialization"
              className="w-full p-3 border border-black rounded-lg text-sm"
            />
          </div>

          {/* License Number */}
          <div>
            <label className="font-semibold">Doctor License Number</label>
            <input
              type="text"
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              placeholder="Enter your License number"
              className="w-full p-3 border border-black rounded-lg text-sm"
            />
          </div>

          {/* DOB */}
          <div>
            <label className="font-semibold">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full p-3 border border-black rounded-lg text-sm"
            />
          </div>
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
  );
}
