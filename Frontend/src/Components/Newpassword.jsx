  import React, { useState } from 'react'
  
  
  export default function Newpassword() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  
  
  const handleReset = () => {
  if (!password || !confirm) return alert("Fill all fields")
  if (password !== confirm) return alert("Passwords do not match")
  alert("Password Reset Successful!")
  }
  
  
  return (
  <div className="relative flex items-center justify-center w-full min-h-screen p-4 overflow-hidden bg-blue-50">
  
  
  {/* Floating background shapes */}
  <div className="absolute w-40 h-40 bg-blue-300 rounded-full top-10 left-10 mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
  <div className="absolute bg-blue-500 rounded-full bottom-10 right-10 w-60 h-60 mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
  
  
  <div className="relative z-10 w-full max-w-md p-10 bg-white border border-blue-100 shadow-2xl rounded-3xl">
  <h1 className="mb-3 text-4xl font-extrabold text-center text-blue-700">CuraMind</h1>
  <p className="mb-6 text-sm text-center text-gray-600">Create New Password</p>
  
  
  <div className="flex flex-col gap-4">
  <input
  type="password"
  placeholder="Enter New Password"
  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
  value={password}
  onChange={e => setPassword(e.target.value)}
  />
  
  
  <input
  type="password"
  placeholder="Confirm New Password"
  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
  value={confirm}
  onChange={e => setConfirm(e.target.value)}
  />
  
  
  <button
  onClick={handleReset}
  className="w-full py-3 text-lg font-medium text-white transition-all bg-blue-600 shadow-md rounded-xl hover:bg-blue-700"
  >
  Reset Password
  </button>
  </div>
  </div>
  </div>
  )
  }
  
  