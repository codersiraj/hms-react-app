import React, { useState } from "react";
import { IC_TYPES, RACES } from "../utils/dropdownOptions";
import { createPatient } from "../api/patient";

type FormDataType = {
  [key: string]: string;
};

export default function PatientRegister() {
  const [formData, setFormData] = useState<FormDataType>({
    PatientName: "",
    BloodGroup: "",
    ICType: "NRIC",
    NRIC: "",
    Nationality: "Malaysian",
    Religion: "",
    Race: "",
    Language: "",
    Address1: "",
    Address2: "",
    Address3: "",
    State: "",
    Country: "Malaysia",
    PinCode: "",
    PH1: "",
    PH2: "",
    RelativeID1: "",
    RelativeName1: "",
    Relationship1: "",
    RelativeID2: "",
    RelativeName2: "",
    Relationship2: "",
    EMail: "",
  });

  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // ✅ Handle NRIC auto DOB
  const handleNricChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, NRIC: value }));

    if (value.length >= 6) {
      const yy = parseInt(value.substring(0, 2), 10);
      const mm = parseInt(value.substring(2, 4), 10);
      const dd = parseInt(value.substring(4, 6), 10);

      if (mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) {
        const fullYear = yy >= 25 ? 1900 + yy : 2000 + yy;
        const dobValue = `${fullYear}-${String(mm).padStart(2, "0")}-${String(dd).padStart(
          2,
          "0"
        )}`;
        setDob(dobValue);
        return;
      }
    }
    setDob("");
  };

  // ✅ Handle ID Type Change (Nationality, Country)
  const handleIdTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      ICType: value,
      Nationality: value === "NRIC" ? "Malaysian" : "",
      Country: value === "NRIC" ? "Malaysia" : "",
    }));
  };

  // ✅ Generic Change Handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ✅ Validation
  const validate = () => {
    const requiredFields = ["PatientName", "ICType", "NRIC"];
    const newErrors: { [key: string]: string } = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) newErrors[field] = "This field is required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setMessage(null);

    const finalData = { ...formData, DOB: dob };

    try {
      const response = await createPatient(finalData);
      setMessage("✅ Patient registered successfully!");
      console.log("Patient created:", response);

      setTimeout(() => setMessage(null), 2000);
    } catch (error: any) {
      console.error("Error creating patient:", error);
      setMessage("❌ Failed to register patient. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Patient Registration</h1>
      </div>

      {/* Message */}
      {message && (
        <div className="p-3 mb-4 text-center rounded-md font-medium bg-gray-50 text-gray-800 shadow-sm">
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg space-y-6"
      >
        {/* Patient Information */}
        <h2 className="text-lg font-semibold text-cyan-700 border-b pb-2">
          Patient Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Patient Name</label>
            <input
              type="text"
              name="PatientName"
              value={formData.PatientName}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Blood Group</label>
            <input
              type="text"
              name="BloodGroup"
              value={formData.BloodGroup}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
            <input
              type="date"
              name="DOB"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              readOnly={formData.ICType === "NRIC"}
              className={`w-full border rounded-lg px-3 py-2 ${
                formData.ICType === "NRIC" ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">IC Type</label>
            <select
              name="ICType"
              value={formData.ICType}
              onChange={handleIdTypeChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-600"
            >
              {IC_TYPES.map((type, i) => (
                <option key={i}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              NRIC / ID Number
            </label>
            <input
              type="text"
              name="NRIC"
              value={formData.NRIC}
              onChange={handleNricChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="e.g. 991231145678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Nationality</label>
            <input
              type="text"
              name="Nationality"
              value={formData.Nationality}
              onChange={handleChange}
              readOnly={formData.ICType === "NRIC"}
              className={`w-full border rounded-lg px-3 py-2 ${
                formData.ICType === "NRIC" ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Religion</label>
            <input
              type="text"
              name="Religion"
              value={formData.Religion}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Race</label>
            <select
              name="Race"
              value={formData.Race}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-600"
            >
              {RACES.map((race, i) => (
                <option key={i}>{race}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Address & Contact */}
        <h2 className="text-lg font-semibold text-cyan-700 border-b pb-2 mt-6">
          Address & Contact
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="Address1"
            value={formData.Address1}
            onChange={handleChange}
            placeholder="Address Line 1"
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="text"
            name="Address2"
            value={formData.Address2}
            onChange={handleChange}
            placeholder="Address Line 2"
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="text"
            name="Address3"
            value={formData.Address3}
            onChange={handleChange}
            placeholder="Address Line 3"
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="text"
            name="State"
            value={formData.State}
            onChange={handleChange}
            placeholder="State"
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="text"
            name="Country"
            value={formData.Country}
            onChange={handleChange}
            readOnly={formData.ICType === "NRIC"}
            className={`w-full border rounded-lg px-3 py-2 ${
              formData.ICType === "NRIC" ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
          <input
            type="text"
            name="PinCode"
            value={formData.PinCode}
            onChange={handleChange}
            placeholder="Pin Code"
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="text"
            name="PH1"
            value={formData.PH1}
            onChange={handleChange}
            placeholder="Phone Number 1"
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="text"
            name="PH2"
            value={formData.PH2}
            onChange={handleChange}
            placeholder="Phone Number 2"
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="email"
            name="EMail"
            value={formData.EMail}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Relatives */}
        <h2 className="text-lg font-semibold text-cyan-700 border-b pb-2 mt-6">
          Relative Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="RelativeName1"
            value={formData.RelativeName1}
            onChange={handleChange}
            placeholder="Relative Name 1"
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="text"
            name="Relationship1"
            value={formData.Relationship1}
            onChange={handleChange}
            placeholder="Relationship 1"
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="text"
            name="RelativeID1"
            value={formData.RelativeID1}
            onChange={handleChange}
            placeholder="Relative ID 1"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-semibold shadow-md"
          >
            {loading ? "Saving..." : "Register Patient"}
          </button>
        </div>
      </form>
    </div>
  );
}
