import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="font-sans w-full min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-8 py-5 bg-white/90 backdrop-blur-md shadow-md z-50">
        <div 
          className="flex items-center gap-2 text-xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span className="text-green-600 text-3xl">🍃</span>
          <span className="tracking-wide text-gray-900 text-2xl">CuraMind</span>
        </div>

        <div className="flex items-center gap-4 relative">
          <button 
            onClick={() => navigate("/Login")}
            className="text-gray-700 font-medium hover:text-green-700 transition"
          >
            Login
          </button>

          {/* Signup dropdown */}
          <div className="relative group inline-block">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow-md font-semibold transition">
              Signup
            </button>

            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-white border border-gray-300
                            rounded-xl shadow-lg p-2 space-y-2 opacity-0 invisible
                            group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
            >
              <div
                onClick={() => navigate("/DoctorSignup")}
                className="w-full py-2 px-3 text-left rounded-lg border border-gray-200
                           hover:bg-green-50 cursor-pointer text-sm font-medium transition"
              >
                👨‍⚕️ Sign up as Doctor
              </div>

              <div
                onClick={() => navigate("/UserSignup")}
                className="w-full py-2 px-3 text-left rounded-lg border border-gray-200
                           hover:bg-green-50 cursor-pointer text-sm font-medium transition"
              >
                👤 Sign up as User
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative flex flex-col md:flex-row items-center justify-center px-6 pt-32 md:pt-40 gap-12 min-h-screen bg-cover bg-center"
               style={{ backgroundImage: `url('https://images.unsplash.com/photo-1588776814546-14fcf7b87a0d?auto=format&fit=crop&w=1470&q=80')` }}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* LEFT TEXT */}
        <div className="relative w-full md:w-1/2 text-center md:text-left bg-white/80 p-6 rounded-2xl shadow-lg z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-snug">
            Your Personal <br />
            Holistic Health Companion
          </h1>
          <p className="text-gray-700 mt-4 mb-6 text-lg md:text-xl">
            Describe your symptoms, get AI-driven advice, or chat with recommended doctors instantly.
          </p>
          <button 
            onClick={() => navigate("/Usersignup")}
            className="bg-green-600 hover:bg-green-700 text-white px-7 py-3 rounded-xl shadow-lg font-semibold text-lg transition transform hover:scale-105 hover:shadow-xl hover:-translate-y-1"
          >
            Get Started
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative w-full md:w-1/2 flex justify-center mt-8 md:mt-0 z-10">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712100.png"
            className="w-72 h-72 md:w-80 md:h-80 object-contain drop-shadow-xl transition transform hover:scale-105 animate-float"
            alt="Health Illustration"
          />
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto py-16 px-6">
        <h2 className="text-center text-3xl font-bold mb-12 text-gray-900">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: "💬", title: "Chat with AI", desc: "Describe your symptoms" },
            { icon: "📞", title: "Get Tips or Doctor", desc: "Receive advice or connect to a doctor" },
            { icon: "🎧", title: "Chat with Doctor", desc: "Live chat with a doctor" },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:scale-105">
              <div className="bg-green-200 p-4 rounded-full text-3xl mb-4">{item.icon}</div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FLOAT ANIMATION */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          .animate-float {
            animation: float 1.5s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
}
