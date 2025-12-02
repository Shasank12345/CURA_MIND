import React from "react";
import { Link } from "react-router-dom"; 

export default function Login() {
  return (
    <div className="relative min-h-screen w-full">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/src/assets/fi.jpg')" }}
      ></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="bg-white bg-opacity-90 shadow-md rounded-lg max-w-lg w-full p-10 flex flex-col space-y-4">

          {/* Logo aligned left */}
          <div className="mb-6">
            <div className="w-36 h-14 rounded-xl bg-indigo-500 flex items-center justify-start px-5 text-black font-bold text-lg">
              CuraMind Logo
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-2 text-center">Welcome Back!</h1>
          <p className="text-gray-500 font-bold mb-6 text-center">
            Where smart technology meets smart health.
          </p>

          <form className="w-full space-y-5">
            <div className="space-y-1 text-sm">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full p-4 border border-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1 text-sm">
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full p-4 border border-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end text-sm">
              <a href="#" className="text-indigo-600 font-bold hover:underline">
                Forgot your password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
            >
              Log in
            </button>
          </form>

          {/* connecting link forget to sign up */}
          <p className="mt-8 text-gray-500 text-center text-lg">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-indigo-600 hover:underline font-medium">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
