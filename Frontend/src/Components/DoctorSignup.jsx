import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DoctorSignup() {
  const navigate = useNavigate();

  // --- State variables ---
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [spec, setSpec] = useState("");
  const [license, setLicense] = useState("");
  const [dob, setDob] = useState("");

  // --- Handle signup ---
  const handleSignup = async () => {
    // Basic validations
    if (!fullname) {
      alert("Please enter your full name");
      return;
    }

    if (!email || emailError) {
      alert("Please enter a valid email");
      return;
    }

    if (!phone || phoneError) {
      alert("Please enter a valid phone number");
      return;
    }

    if (!spec) {
      alert("Please enter your specialization");
      return;
    }

    if (!license) {
      alert("Please enter your license number");
      return;
    }

    if (!dob) {
      alert("Please select your date of birth");
      return;
    }

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.status === 201) {
        alert("Signup successful! Temp password sent to email.");
        navigate("/");
      } else if (res.status === 409) {
        alert("Email already exists. Please use a different email.");
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center"
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
                setEmailError(
                  !regex.test(e.target.value)
                    ? "Please enter a valid email address"
                    : ""
                );
              }}
              placeholder="Enter your email address"
              className={`w-full p-3 border rounded-lg text-sm ${
                emailError ? "border-red-500" : "border-black"
              }`}
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
              className={`w-full p-3 border rounded-lg text-sm ${
                phoneError ? "border-red-500" : "border-black"
              }`}
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
