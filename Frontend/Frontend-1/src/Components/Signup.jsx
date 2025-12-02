import { useState } from "react";
import { Link } from "react-router-dom";
import bg from "../assets/fi.jpg";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('/src/assets/fi.jpg')` }}
    >
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center">Sign Up in CuraMind</h1>

        <p className="text-gray-500 font-semibold text-center mb-4 text-sm mt-2">
          Fill out your information to be signed up.
        </p>

        <div className="space-y-2 text-sm">
          <div>
            <label className="font-semibold">Full Name</label>
            <input
              type="text"
              placeholder="Enter your Full Name"
              className="w-full p-3 border border-black rounded-lg text-sm"
            />
          </div>

         
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
              className={`w-full p-3 border rounded-lg text-sm ${
                emailError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-black focus:ring-indigo-500"
              }`}
            />
            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
          </div>

          
          <div>
            <label className="font-semibold">Password</label>
            <input
              type="password"
              placeholder="Enter your Password"
              className="w-full p-3 border border-black rounded-lg text-sm"
            />
          </div>

         
          <div>
            <label className="font-semibold">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => {
                const value = e.target.value;
                setPhone(value);

                const onlyDigits = /^\d+$/.test(value);
                setPhoneError(!onlyDigits || value.length !== 10 ? "Phone number must be 10 digits" : "");
              }}
              placeholder="Enter your Phone number"
              className={`w-full p-3 border rounded-lg text-sm ${
                phoneError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-black focus:ring-indigo-500"
              }`}
            />
            {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
          </div>

          
          <div>
            <label className="font-semibold">DOB</label>
            <input
              type="text"
              placeholder="YYYY-MM-DD"
              className="w-full p-3 border border-black rounded-lg text-sm"
            />
          </div>
        </div>

          <button className="mt-4 w-full bg-indigo-600 text-white p-3 rounded-md font-bold text-sm hover:bg-blue-700 transition">
          Sign Up
        </button>
       
      </div>
    </div>
  );
}
