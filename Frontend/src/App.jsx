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
import Sidebar from './Components/Admin/Sidebar'
import Dashboard from "./Components/Admin/Dashboard";
import DoctorDetail from "./Components/Admin/DoctorDetail";
import Rejectoption from './Components/Admin/Rejectoption';

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

  {/* Admin Routes */}
  <Route path="/adminpannel" element={<Sidebar/>}>
   
    <Route index element={<Dashboard />} /> 
    <Route path="dashboard" element={<Dashboard />} />
      <Route path="rejectoption" element={<Rejectoption />} />
        <Route path="doctordetail" element={<DoctorDetail/>} />
   </Route>
</Routes>


      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default App;