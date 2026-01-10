import { useState } from "react";

export default function ProfileEdit() {
  const [formData, setFormData] = useState({
    name: "",
    status: "",
    dob: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    weightLbs: "",
    weightKg: "",
    heightFt: "",
    heightCm: "",
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",
    emergencyEmail: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log("Saved Data:", formData);
    alert("Profile saved successfully");
  };

  return (
    // <div className="min-h-screen bg-gray-50 p-6">
    <div className="font-sans w-full min-h-screen bg-gray-300">
      <div className="max-w-5xl mx-auto space-y-8">
  <div className="bg-white border border-black rounded-xl px-5 py-3 shadow-sm w-fit mx-auto">
    <h1 className="text-2xl font-semibold text-gray-900 text-center">
      Edit Patient Profile
    </h1>
  </div>


        {/* Patient Info */}
        <Section title="Patient Information">
          <Grid>
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />

            <Input
              label="Date of Birth"
              type="date"
              value={formData.dob}
              onChange={(e) => handleChange("dob", e.target.value)}
            />

            <Input
              label="Age"
              type="number"
              value={formData.age}
              onChange={(e) => handleChange("age", e.target.value)}
            />

            <Select
              label="Gender"
              value={formData.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Select>

            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            <Input
              label="Address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </Grid>
        </Section>

        {/* Physical */}
        <Section title="Vitals & Measurements">
          <Grid>
            <Input
              label="Weight (lbs)"
              value={formData.weightLbs}
              onChange={(e) => handleChange("weightLbs", e.target.value)}
            />
            <Input
              label="Weight (kg)"
              value={formData.weightKg}
              onChange={(e) => handleChange("weightKg", e.target.value)}
            />
            <Input
              label="Height (ft/in)"
              value={formData.heightFt}
              onChange={(e) => handleChange("heightFt", e.target.value)}
            />
            <Input
              label="Height (cm)"
              value={formData.heightCm}
              onChange={(e) => handleChange("heightCm", e.target.value)}
            />
          </Grid>
        </Section>

        {/* Emergency */}
        <Section title="Emergency Contact">
          <Grid>
            <Input
              label="Name"
              value={formData.emergencyName}
              onChange={(e) => handleChange("emergencyName", e.target.value)}
            />
            <Input
              label="Relationship"
              value={formData.emergencyRelation}
              onChange={(e) => handleChange("emergencyRelation", e.target.value)}
            />
            <Input
              label="Phone"
              value={formData.emergencyPhone}
              onChange={(e) => handleChange("emergencyPhone", e.target.value)}
            />
            <Input
              label="Email"
              value={formData.emergencyEmail}
              onChange={(e) => handleChange("emergencyEmail", e.target.value)}
            />
          </Grid>
        </Section>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable UI ---------- */

function Section({ title, children }) {
  return (
    <div className="bg-white border rounded-2xl p-6 space-y-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      {children}
    </div>
  );
}

function Grid({ children }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

function Input({ label, ...props }) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm text-gray-600">{label}</label>}
      <input
        {...props}
        className="w-full rounded-lg border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
      />
    </div>
  );
}

function Select({ label, children, ...props }) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm text-gray-600">{label}</label>}
      <select
        {...props}
        className="w-full rounded-lg border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
      >
        {children}
      </select>
    </div>
  );
}