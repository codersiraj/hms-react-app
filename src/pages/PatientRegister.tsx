import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus, Minus } from "lucide-react";
import { Listbox } from "@headlessui/react";

type Doctor = {
  memberId: string;
  fullName1: string;
  nric: string;
  drSpecialization?: string;
};

const apiBaseUrl =
  (window as any)._env_?.API_BASE_URL || "https://localhost:7181";

export default function PatientRegister() {
  const location = useLocation();
  const navigate = useNavigate();

  const receivedNRIC = location.state?.nric || "";
  const focusField = location.state?.focusField;

  const fullNameRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    memberType: "Patient",
    idType: "NRIC",
    nric: "",
    fullName: "",
    dob: "",
    gender: "Male",
    nationality: "Malaysian",
    address1: "",
    address2: "",
    postalCode: "",
    district: "",
    state: "",
    country: "Malaysia",
    email: "",
    phone: "",
    blood: "",
    remark: "",
  });

  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(true);

  // 🩺 Doctor Info
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // ✅ Clear navigation state (avoids stale state when reloading)
  useEffect(() => {
    if (location.state) {
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  // ✅ Focus handling from Header
  useEffect(() => {
    if (focusField === "fullName") {
      setTimeout(() => {
        fullNameRef.current?.focus();
        fullNameRef.current?.select();
      }, 300);
    }
  }, [focusField]);

  // ✅ Fetch doctors list
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/Doctors/get-doctors`);
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  // ✅ Auto-populate based on NRIC
  useEffect(() => {
    if (!receivedNRIC) return;

    if (receivedNRIC.length === 14) {
      const yy = parseInt(receivedNRIC.substring(0, 2), 10);
      const mm = parseInt(receivedNRIC.substring(2, 4), 10);
      const dd = parseInt(receivedNRIC.substring(4, 6), 10);

      if (mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) {
        const fullYear = yy >= 25 ? 1900 + yy : 2000 + yy;
        const dobValue = `${fullYear}-${String(mm).padStart(
          2,
          "0"
        )}-${String(dd).padStart(2, "0")}`;
        setDob(dobValue);
        setFormData((prev) => ({
          ...prev,
          nric: receivedNRIC,
          idType: "NRIC",
          nationality: "Malaysian",
          country: "Malaysia",
        }));
      }
    } else {
      setDob("");
      setFormData((prev) => ({
        ...prev,
        nric: receivedNRIC,
        idType: "Passport",
        nationality: "",
        country: "",
      }));
    }
  }, [receivedNRIC]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit Patient + DoctorId
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!selectedDoctor) {
      setMessage("❌ Please select a doctor before saving.");
      setLoading(false);
      return;
    }

    try {
      const doctorId = selectedDoctor.memberId;

      const response = await fetch(
        `${apiBaseUrl}/api/patient/create?doctorId=${doctorId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            memberType: formData.memberType,
            idType: formData.idType,
            nric: formData.nric,
            fullName1: formData.fullName,
            dob: dob,
            gender: formData.gender === "Male" ? "M" : "F",
            nationality: formData.nationality,
            address1: formData.address1,
            address2: formData.address2,
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
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage("✅ " + (result.message || "Patient registered successfully!"));
        setTimeout(() => {
          setShowForm(false);
          setMessage(null);
        }, 2000);
      } else {
        setMessage("❌ " + (result.message || "Error creating patient"));
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
        <h1 className="text-2xl font-bold text-gray-800">Patient Registration</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center bg-cyan-800 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          <span className="block sm:hidden">
            {showForm ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          </span>
          <span className="hidden sm:flex items-center">
            {showForm ? (
              <>
                <Minus className="mr-2 h-5 w-5" /> Hide Form
              </>
            ) : (
              <>
                <Plus className="mr-2 h-5 w-5" /> New Patient
              </>
            )}
          </span>
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-lg space-y-6"
        >
          {message && (
            <div className="p-2 rounded-md text-center font-medium mb-2 bg-gray-100 text-gray-800">
              {message}
            </div>
          )}

          {/* === Row 1: ID Type / NRIC / Full Name === */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">ID Type</label>
              <input
                type="text"
                name="idType"
                value={formData.idType}
                readOnly
                className="w-full border rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">NRIC / Passport No</label>
              <input
                type="text"
                name="nric"
                value={formData.nric}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Full Name</label>
              <input
                ref={fullNameRef}
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* === Row 2: DOB / Gender / Blood Group === */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                readOnly={formData.idType === "NRIC"}
                className={`w-full border rounded-lg px-3 py-2 ${formData.idType === "NRIC" ? "bg-gray-100 cursor-not-allowed" : ""
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

          {/* === Row 3: Address 1 / Address 2 === */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          {/* === Row 4: Nationality / State / Country / Pin === */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Nationality</label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                readOnly={formData.idType === "NRIC"}
                className={`w-full border rounded-lg px-3 py-2 ${formData.idType === "NRIC" ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
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
                readOnly={formData.idType === "NRIC"}
                className={`w-full border rounded-lg px-3 py-2 ${formData.idType === "NRIC" ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Pin Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* === Row 5: Phone / Email / Remark === */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Phone - smaller box */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-600">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* Email - medium box */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* Remark - long box */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-600">Remark</label>
              <input
                type="text"
                name="remark"
                value={formData.remark}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>


          {/* === Doctor Info === */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Doctor Information</h2>

            {/* Mobile Dropdown */}
            <div className="block md:hidden mb-6">
              <Listbox value={selectedDoctor} onChange={setSelectedDoctor}>
                <Listbox.Button className="w-full border rounded-lg px-3 py-2 text-left bg-white">
                  {selectedDoctor
                    ? `${selectedDoctor.fullName1}`
                    : "-- Select a Doctor --"}
                </Listbox.Button>

                <Listbox.Options className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                  {doctors.length > 0 ? (
                    doctors.map((doctor) => (
                      <Listbox.Option
                        key={doctor.nric}
                        value={doctor}
                        className={({ active }) =>
                          `cursor-pointer px-3 py-2 ${active ? "bg-cyan-700 text-white" : "text-gray-800"
                          }`
                        }
                      >
                        {doctor.fullName1} ({doctor.nric})
                      </Listbox.Option>
                    ))
                  ) : (
                    <p className="p-2 text-gray-500 text-sm text-center">
                      Loading doctors...
                    </p>
                  )}
                </Listbox.Options>
              </Listbox>
            </div>

            {/* Desktop Grid */}
            <div className="hidden md:block">
              {doctors.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {doctors.map((doctor) => {
                    const isSelected = selectedDoctor?.nric === doctor.nric;
                    return (
                      <div
                        key={doctor.nric}
                        onClick={() => setSelectedDoctor(doctor)}
                        className={`p-4 rounded-xl border shadow-sm cursor-pointer transition-all ${isSelected
                            ? "bg-cyan-700 text-white border-cyan-800"
                            : "bg-white hover:bg-cyan-50"
                          }`}
                      >
                        <p className="font-semibold text-lg text-center">
                          {doctor.fullName1}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-sm mb-6">Loading doctors...</p>
              )}
            </div>
          </div>

          {/* === Buttons === */}
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
              disabled={loading || !selectedDoctor}
              className={`px-4 py-2 rounded-lg text-white ${loading || !selectedDoctor
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-cyan-600 hover:bg-cyan-700"
                }`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
