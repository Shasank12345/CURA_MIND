import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
 import Login from './Components/Login'
import "./index.css"

import './App.css'
import UserSignup from './Components/UserSignup'
import DoctorSignup from './Components/DoctorSignup'
import HomePage from './Components/Homepage/HomePage'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
 

  return (
    <>
    <router>
    <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/Usersignup" element={<UserSignup />} />
    <Route path="/DoctorSignup" element={<DoctorSignup />} />
    <Route path="/Login" element={<Login />} />
    </Routes>  
       </router>
    </>
  )
}

export default App