import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'


export default function ForgetPassword() {
const [email, setEmail] = useState('')
const navigate = useNavigate()


const handleSendOTP = () => {
if (!email) return alert('Enter your email')
navigate('/otp', { state: { email } })
}


return (
<div className="relative flex items-center justify-center w-full min-h-screen p-4 overflow-hidden bg-blue-50">


{/* Soft floating shapes */}
<div className="absolute w-40 h-40 bg-blue-300 rounded-full top-10 left-10 mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
<div className="absolute bg-blue-500 rounded-full bottom-10 right-10 w-60 h-60 mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>


{/* Centered Card */}
<div className="relative z-10 w-full max-w-md p-10 bg-white border border-blue-100 shadow-2xl rounded-3xl">
<h1 className="mb-3 text-4xl font-extrabold tracking-tight text-center text-blue-700">CuraMind</h1>
<p className="mb-6 text-sm text-center text-gray-600">Your AI Health Companion</p>


<h2 className="mb-6 text-2xl font-semibold text-center text-gray-800">Forgot Password</h2>


<div className="flex flex-col gap-4">
<input
type="email"
placeholder="Enter your Email"
className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
value={email}
onChange={(e) => setEmail(e.target.value)}
/>


<button
onClick={handleSendOTP}
className="w-full py-3 text-lg font-medium text-white transition-all bg-blue-600 shadow-md rounded-xl hover:bg-blue-700"
>
Send OTP
</button>
</div>
</div>
</div>
)
}