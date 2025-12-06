import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
 import Login from './Components/Login'
import "./index.css"
import ForgetPassword from './Components/Forgetpassword'

import './App.css'
import UserSignup from './Components/UserSignup'
import DoctorSignup from './Components/DoctorSignup'
import HomePage from './Components/Homepage/HomePage'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OTP from './Components/OTP'
import Newpassword from './Components/Newpassword'
function App() {
 

  return (
    <>
    <router>
    <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/Usersignup" element={<UserSignup />} />
    <Route path="/DoctorSignup" element={<DoctorSignup />} />
    <Route path="/Login" element={<Login />} />
    <Route path='/ForgotPassword' element={<ForgetPassword/>}/>
    <Route path="/otp" element={<OTP/>}/>
    <Route path ="/newpassword" element={<Newpassword/>}/>
    </Routes>  
       </router>
    </>
  )
}

export default App