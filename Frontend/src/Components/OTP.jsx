import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useNavigate } from "react-router-dom";


export default function OTP() {
const [otp, setOtp] = useState(['', '', '', '', '', ''])
const [timer, setTimer] = useState(120) // 2 minutes
const location = useLocation()
const email = location.state?.email || ""
const navigate = useNavigate()

useEffect(() => {
if (timer <= 0) return
const countdown = setInterval(() => setTimer(prev => prev - 1), 1000)
return () => clearInterval(countdown)
}, [timer])


const handleChange = (value, index) => {
if (/^[0-9]?$/.test(value)) {
const newOtp = [...otp]
newOtp[index] = value
setOtp(newOtp)


if (value && index < 5) {
document.getElementById(`otp-${index + 1}`).focus()
}
}
}


const handleVerify = () => {
const code = otp.join('')
if (code.length < 6) return alert('Enter all 6 digits of OTP')
navigate('/newpassword')
}


return (
<div className="relative flex items-center justify-center w-full min-h-screen p-4 overflow-hidden bg-blue-50">


{/* Floating blur shapes */}
<div className="absolute top-0 left-0 bg-blue-300 rounded-full w-60 h-60 mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
<div className="absolute bottom-0 right-0 bg-blue-500 rounded-full w-72 h-72 mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>


<div className="relative z-10 w-full max-w-md p-10 bg-white border border-blue-100 shadow-2xl rounded-3xl">
<h1 className="mb-3 text-4xl font-extrabold text-center text-blue-700">CuraMind</h1>
<p className="mb-6 text-sm text-center text-gray-600">OTP Verification</p>


<p className="mb-6 text-center text-gray-700">OTP sent to <span className="font-semibold">{email}</span></p>


{/* Timer */}
<p className="mb-4 font-medium text-right text-red-600">Time Left: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}</p>


{/* OTP Boxes */}
<div className="flex justify-center gap-3 mb-6">
{otp.map((digit, index) => (
<input
key={index}
id={`otp-${index}`}
type="text"
maxLength="1"
className="w-12 h-12 text-xl text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
value={digit}
onChange={(e) => handleChange(e.target.value, index)}
/>
))}
</div>


<button
onClick={handleVerify}
className="w-full py-3 text-lg font-medium text-white transition-all bg-blue-600 shadow-md rounded-xl hover:bg-blue-700"
>
Verify OTP
</button>
</div>
</div>
)
}