import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages & Components
import Login from "./Components/Login";
import ForgetPassword from "./Components/Forgetpassword";
import UserSignup from "./Components/UserSignup";
import DoctorSignup from "./Components/DoctorSignup";
import HomePage from "./Components/Homepage/HomePage";
import OTP from "./Components/OTP";
import NewPassword from "./Components/Newpassword";

// Toast notifications
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Usersignup" element={<UserSignup />} />
        <Route path="/DoctorSignup" element={<DoctorSignup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/ForgotPassword" element={<ForgetPassword />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/newpassword" element={<NewPassword />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default App;
