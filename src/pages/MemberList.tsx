import React, { useState } from "react";
import { Plus } from "lucide-react";
import MemberTable from "../components/member/MemberTable";

const apiBaseUrl = (window as any)._env_?.API_BASE_URL || "https://localhost:7181";

export default function MemberList() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // ✅ Form state
  const [formData, setFormData] = useState({
    memberType: "Doctor",
    idType: "NRIC",
    nric: "",
    fullName: "",
    dob: "",
    gender: "Male",
    nationality: "Malaysian", // 👈 default if NRIC
    address1: "",
    address2: "",
    address3: "",
    postalCode: "",
    district: "",
    state: "",
    country: "",
    email: "",
    phone: "",
    blood: "",
    remark: "",
  });

  // ✅ Auto DOB from NRIC logic
  const handleNricChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, nric: value }));

    // NRIC must be at least 6 digits
    if (value.length >= 6) {
      const yy = parseInt(value.substring(0, 2), 10);
      const mm = parseInt(value.substring(2, 4), 10);
      const dd = parseInt(value.substring(4, 6), 10);

      if (mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) {
        const fullYear = yy >= 25 ? 1900 + yy : 2000 + yy;
        const dobValue = `${fullYear}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
        setFormData((prev) => ({ ...prev, dob: dobValue }));
      }
    }
  };

  // ✅ ID Type change logic (for Nationality behavior)
  const handleIdTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      idType: value,
      nationality: value === "NRIC" ? "Malaysian" : "",
    }));
  };

  // ✅ Generic field change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmitSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // ✅ Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${apiBaseUrl}/api/member/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberType: formData.memberType,
          idType: formData.idType,
          nric: formData.nric,
          fullName1: formData.fullName,
          dob: formData.dob,
          gender: formData.gender === "Male" ? "M" : "F",
          nationality: formData.nationality,
          address1: formData.address1,
          address2: formData.address2,
          address3: formData.address3,
          postCode: formData.postalCode,
          district: formData.district,
          stateName: formData.state,
          country: formData.country,
          email: formData.email,
          ph1: formData.phone,
          blood: formData.blood,
          remark: formData.remark,
          isPWD: false,
          createdBy: "system",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("✅ " + result.message);
        handleFormSubmitSuccess();
        setTimeout(() => {
          setShowForm(false);
          setMessage(null);
        }, 2000);
      } else {
        setMessage("❌ " + (result.message || "Error creating member"));
      }
    } catch (error: any) {
      setMessage("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Members</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create Member
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-lg space-y-4"
        >
          {message && (
            <div className="p-2 rounded-md text-center font-medium mb-2 bg-gray-100 text-gray-800">
              {message}
            </div>
          )}

          {/* Row 1: Member Type, ID Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Member Type</label>
              <select
                name="memberType"
                value={formData.memberType}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-600"
              >
                <option>Doctor</option>
                <option>Staff</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">ID Type</label>
              <select
                name="idType"
                value={formData.idType}
                onChange={handleIdTypeChange} // 👈 Custom logic for Nationality
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-600"
              >
                <option>NRIC</option>
                <option>Passport</option>
              </select>
            </div>
          </div>

          {/* Row 2: NRIC, Full Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">NRIC</label>
              <input
                type="text"
                name="nric"
                value={formData.nric}
                onChange={handleNricChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="e.g. 991231145678"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Row 3: DOB, Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">DOB</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                readOnly={formData.idType === "NRIC"} // 👈 Lock when ID Type is NRIC
                className={`w-full border rounded-lg px-3 py-2 ${
                  formData.idType === "NRIC" ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
          </div>

          {/* Row 4: Nationality, Postal Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Nationality</label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                readOnly={formData.idType === "NRIC"} // 👈 Lock for NRIC
                className={`w-full border rounded-lg px-3 py-2 ${
                  formData.idType === "NRIC" ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                placeholder={formData.idType === "NRIC" ? "" : "Enter nationality"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Address 1</label>
            <input
              type="text"
              name="address1"
              value={formData.address1}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Address 2</label>
            <input
              type="text"
              name="address2"
              value={formData.address2}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* Row 6: City, State, Country */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">City</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Row 7: Email, Phone, Blood Group */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Blood Group</label>
              <input
                type="text"
                name="blood"
                value={formData.blood}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Remark */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Remark</label>
            <textarea
              name="remark"
              value={formData.remark}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              rows={3}
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg border bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}

      {/* ✅ Member Table */}
      <MemberTable refreshTrigger={refreshTrigger} />
    </div>
  );
}
