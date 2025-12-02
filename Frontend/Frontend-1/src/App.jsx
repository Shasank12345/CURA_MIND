import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
 import Login from './Components/Login'
import "./index.css"

import './App.css'
import Signup from './Components/Signup'
import { Route, Routes } from 'react-router-dom'

function App() {
 

  return (
    <>
    <Routes>
      <Route path="/" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    
    </Routes>  
       
    </>
  )
}

export default App
