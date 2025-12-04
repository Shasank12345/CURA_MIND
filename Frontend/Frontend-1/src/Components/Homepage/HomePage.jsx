import { useNavigate } from "react-router-dom";
export default function App() {
  const navigate = useNavigate();
    return (

    <div className="font-sans overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">

      {/* NAVBAR */}
      <nav className="w-full py-5 px-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <span className="text-green-600 text-3xl">🍃</span>
          <span className="tracking-wide">CuraMind</span>
        </div>

        <div className="flex items-center gap-4">
          <button 
          onClick={() => navigate("/Login")}
          className="text-gray-700 hover:text-green-700 transition">Login</button>
          <div className="relative group inline-block">
  <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-md transition">
    Signup
  </button>

  <div
    className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-white border border-black
               rounded-lg shadow-md p-2 space-y-1 opacity-0 invisible
               group-hover:opacity-100 group-hover:visible transition-all duration-200"
  >
    <div
      onClick={() => navigate("/DoctorSignup")}
      className="w-full py-1 px-2 text-left rounded-md border border-black
                 hover:bg-indigo-50 cursor-pointer text-sm transition font-semibold"
    >
      👨‍⚕️ Sign up as Doctor
    </div>

    <div
      onClick={() => navigate("/UserSignup")}
      className="w-full py-1 px-2 text-left rounded-md border border-black 
                 hover:bg-indigo-50 cursor-pointer text-sm transition font-semibold"
    >
      👤 Sign up as User
    </div>
  </div>
</div>

        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="max-w-8xl mx-auto h-[88vh] flex flex-col justify-center">

        <div className="flex flex-col md:flex-row items-center px-8">

          {/* LEFT TEXT BOX */}
          <div className="w-full md:w-1/2">
            <div className="bg-white/90 p-6 rounded-2xl shadow-xl">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-800">
                Our Personal <br />Holistic health Campanion

              </h1>
              <p className="text-gray-700 mt-4 mb-8 text-lg">
                Describe your symptoms and get helpful tips or chat with a recommended doctor.
              </p>
              <button className="bg-green-600 hover:bg-green-700 shadow-lg text-white px-6 py-3 rounded-lg transition transform hover:scale-105">
                Get Started
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="w-full md:w-1/2 flex justify-center mt-10 md:mt-0">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4712/4712100.png"
              className="w-72 h-72 object-contain drop-shadow-lg hover:scale-105 transition"
            />
          </div>

        </div>

        {/* HOW IT WORKS SECTION BOX */}
        <div className="mt-10 bg-white/90 p-10 rounded-2xl shadow-xl mx-6">

          <h2 className="text-center text-2xl font-bold mb-6 text-gray-800">
            How it works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="flex flex-col items-center text-center bg-gray-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
              <div className="bg-green-200 p-4 rounded-2xl text-2xl mb-3">💬</div>
              <h3 className="font-semibold text-gray-800 text-lg">Chat with AI</h3>
              <p className="text-gray-600 text-sm">Describe your symptoms</p>
            </div>

            <div className="flex flex-col items-center text-center bg-gray-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
              <div className="bg-green-200 p-4 rounded-2xl text-2xl mb-3">📞</div>
              <h3 className="font-semibold text-gray-800 text-lg">Get tips or doctor</h3>
              <p className="text-gray-600 text-sm">Receive advice or connect to a doctor</p>
            </div>

            <div className="flex flex-col items-center text-center bg-gray-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
              <div className="bg-green-200 p-4 rounded-2xl text-2xl mb-3">🎧</div>
              <h3 className="font-semibold text-gray-800 text-lg">Chat with doctor</h3>
              <p className="text-gray-600 text-sm">Live chat with a doctor</p>
            </div>

          </div>
        </div>

      </section>

    </div>
  );
}