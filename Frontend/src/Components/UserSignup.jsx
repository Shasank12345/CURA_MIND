import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserSignup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");

  const handleSignup = async () => {
    if (!fullName) return toast.error("Enter your full name");
    if (!email || emailError) return toast.error("Enter valid email");
    if (!phone || phoneError) return toast.error("Enter valid phone number");
    if (!address) return toast.error("Enter your address");
    if (!dob) return toast.error("Select your date of birth");

    const payload = { Full_Name: fullName, Email: email, Phone_Number: phone, Address: address, DOB: dob, role: "User" };

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
        toast.error("Email already exists. Use a different email.");
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
      <div className="bg-white bg-opacity-90 p-8 rounded-3xl shadow-lg max-w-md w-full space-y-4">
        <h1 className="text-3xl font-bold text-center text-blue-700">Sign Up as User</h1>
        <p className="text-gray-500 font-semibold text-center mb-4 text-sm mt-2">
          Fill out your information to be signed up.
        </p>
        <div>
 <label className="font-semibold">Full Name</label>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-3 border border-black-300 rounded-lg text-sm"
        />
        </div>
 <label className="font-semibold">Email</label>
        <input
        
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            setEmailError(!regex.test(e.target.value) ? "Invalid email" : "");
          }}
          className={`w-full p-3 border rounded-lg text-sm ${emailError ? "border-red-500" : "border-black-300"}`}
        />
        {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
 <label className="font-semibold">Phone number</label>
        <input
        
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => {
            const val = e.target.value;
            setPhone(val);
            if (!/^\d*$/.test(val)) setPhoneError("Numbers only");
            else if (val.length !== 10) setPhoneError("Phone must be 10 digits");
            else setPhoneError("");
          }}
          className={`w-full p-3 border rounded-lg text-sm ${phoneError ? "border-red-500" : "border-black-300"}`}
         
        />
        {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
 <label className="font-semibold">Address</label>
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-3 border border-black-300 rounded-lg text-sm"
        />
 <label className="font-semibold">DOB</label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="w-full p-3 border border-black-300 rounded-lg text-sm"
        />

        <button
          onClick={handleSignup}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
