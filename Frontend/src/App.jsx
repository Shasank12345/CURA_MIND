import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Auth & Public
import Login from "./Components/Login";
import ForgetPassword from "./Components/Forgetpassword";
import UserSignup from "./Components/UserSignup";
import DoctorSignup from "./Components/DoctorSignup";
import HomePage from "./Components/Homepage/HomePage";
import OTP from "./Components/OTP";
import NewPassword from "./Components/Newpassword";

// Admin
import Sidebar from './Components/Admin/Sidebar'
import Dashboard from "./Components/Admin/Dashboard";
import DoctorDetail from "./Components/Admin/DoctorDetail";
import Rejectoption from './Components/Admin/Rejectoption';
// import CombinedAudit from "./Components/Admin/CombinedAudit";
// import User1 from "./Components/Admin/User1";
import DoctorResponse1 from './Components/Admin/DoctorResponse1'
import DoctorResponse2 from "./Components/Admin/DoctorResponse2";
import MessageTriage from "./Components/Admin/Messagetriage";

// User (Module 2)
import Navbar from "./Components/Module-2/Navbar";
import UserDashboard from "./Components/Module-2/UserDashboard";
import Chatbot from "./Components/Module-2/Chatbot";
import UserProfile from "./Components/Module-2/UserProfile";
import UserProfileEdit from "./Components/Module-2/ProfileEdit";
import AvailableDoctorList from "./Components/Module-2/Avaibledoctorlist";
import WaitingRoom from "./Components/Module-2/WaitingRoom";


// Doctor (Module 3)
import DoctorNav from "./Components/Module-3/DoctorNav";
import DoctorDashboard from "./Components/Module-3/DoctorDashboard";
import DoctorProfileEdit from "./Components/Module-3/EditProfile";
import Onetoonechat from "./Components/Onetoonechat"; 
import Profile from "./Components/Module-3/Profile";
import Views from "./Components/Module-3/Views";

// Toast notifications
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import User1 from "./Components/Admin/User1";

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
        <Route path="/adminpannel" element={<Sidebar />}>
          {/* Use Navigate to prevent landing on a blank sidebar */}
          <Route index element={<Navigate to="dashboard" replace />} /> 
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="rejectoption" element={<Rejectoption />} />
          <Route path="doctordetail" element={<DoctorDetail />} />
          <Route path="message-triage" element={<MessageTriage />} />
          
          {/* Use the Combined View for Triage Audit */}
          <Route path="User1" element={<User1/>} />
          
          <Route path="doctorresponse1" element={<DoctorResponse1 />} />
          <Route path="doctorresponse2" element={<DoctorResponse2 />} />
        </Route>

        {/* User Routes */}
        <Route path="/userpannel" element={<Navbar />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="chatbot" element={<Chatbot />} />
            <Route path="Avaibledoctorlist" element={<AvailableDoctorList />} />
          <Route path="userprofile" element={<UserProfile />} />
          <Route path="profileedit" element={<UserProfileEdit />} />
          <Route path="onetoonechat" element={<Onetoonechat />} />
          <Route path="waiting-room" element={<WaitingRoom />} />
          
          
        </Route>

        {/* Doctor Routes */}
        <Route path="/doctordashboard" element={<DoctorNav />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="onetoonechat" element={<Onetoonechat />} />
          <Route path="editprofile" element={<DoctorProfileEdit />} />
          <Route path="profile" element={<Profile />} />
           <Route path="views/:id" element={<Views />} />
        </Route>
        
      </Routes>

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default App;