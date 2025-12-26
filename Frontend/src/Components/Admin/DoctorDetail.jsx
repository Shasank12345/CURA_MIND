export default function App() {
  const doctors = [
    {
      id: 1,
      name: "Dr. Anil Sharma",
      specialization: "Cardiologist",
      licenseNo: "LIC-45821",
      phone: "+977-9812345678",
    },
    {
      id: 2,
      name: "Dr. Sita Koirala",
      specialization: "Neurologist",
      licenseNo: "LIC-78412",
      phone: "+977-9801122334",
    },
    {
      id: 3,
      name: "Dr. Rajesh Thapa",
      specialization: "Orthopedic",
      licenseNo: "LIC-36987",
      phone: "+977-9845678910",
    },
  ];

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-purple-900 via-pink-700 to-purple-700">
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative z-10 p-10">
        <h1 className="text-3xl font-extrabold text-white tracking-wide drop-shadow-lg mb-8">
          Doctors Associated With Us
        </h1>

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl ring ring-black overflow-hidden border-2 border-black">
          <table className="w-full text-sm text-left border-collapse">

            <thead className="bg-gradient-to-r from-pink-200 to-purple-200 text-purple-900">
              <tr>
                <th className="px-6 py-4 font-bold uppercase tracking-wide border-b border-black">S.N.</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wide border-b border-black">
                  Doctor Name
                </th>
                <th className="px-6 py-4 font-bold uppercase tracking-wide border-b border-black">
                  Specialization
                </th>
                <th className="px-6 py-4 font-bold uppercase tracking-wide border-b border-black">
                  License No
                </th>
                <th className="px-6 py-4 font-bold uppercase tracking-wide border-b border-black">
                  Phone Number
                </th>
              </tr>
            </thead>

 
            <tbody>
              {doctors.map((doc, index) => (
                <tr
                  key={doc.id}
                  className={`transition-all hover:bg-purple-100 cursor-pointer ${
                    index % 2 === 0 ? "bg-white/90" : "bg-gray-50/70"
                  }`}
                >
                  <td className="px-6 py-4 font-bold text-gray-700 border-b border-black">{index + 1}</td>
                  <td className="px-6 py-4 font-bold text-gray-900 border-b border-black">{doc.name}</td>
                  <td className="px-6 py-4 font-semibold text-gray-700 border-b border-black">{doc.specialization}</td>
                  <td className="px-6 py-4 font-semibold text-gray-700 border-b border-black">{doc.licenseNo}</td>
                  <td className="px-6 py-4 font-semibold text-gray-700 border-b border-black">{doc.phone}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}