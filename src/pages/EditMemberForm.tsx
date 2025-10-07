import React, { useEffect, useState } from "react";

interface EditMemberFormProps {
  memberId: string;
  onClose: () => void;
  onUpdated: () => void;
}

const apiBaseUrl = (window as any)._env_?.API_BASE_URL || "https://localhost:7181";

export default function EditMemberForm({ memberId, onClose, onUpdated }: EditMemberFormProps) {
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 🔑 Fetch member by ID
  useEffect(() => {
    const fetchMember = async () => {
      const res = await fetch(`${apiBaseUrl}/api/member/${memberId}`);
      const data = await res.json();

      // Normalize fields for NRIC
      if (data.idType === "NRIC") {
        data.nationality = "Malaysian";
        data.country = "Malaysia";
      }

      setFormData(data);
    };
    fetchMember();
  }, [memberId]);

  // ✅ NRIC → DOB auto-fill logic (updated to clear when invalid)
  const handleNricChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev: any) => ({ ...prev, nric: value }));

    if (value.length >= 6) {
      const yy = parseInt(value.substring(0, 2), 10);
      const mm = parseInt(value.substring(2, 4), 10);
      const dd = parseInt(value.substring(4, 6), 10);

      if (mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) {
        const fullYear = yy >= 25 ? 1900 + yy : 2000 + yy;
        const dobValue = `${fullYear}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
        setFormData((prev: any) => ({ ...prev, dob: dobValue }));
        return;
      }
    }

    // ❌ Clear DOB if NRIC becomes invalid/incomplete
    setFormData((prev: any) => ({ ...prev, dob: "" }));
  };

  // ✅ ID Type change logic (auto set Nationality/Country)
  const handleIdTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData((prev: any) => ({
      ...prev,
      idType: value,
      nationality: value === "NRIC" ? "Malaysian" : "",
      country: value === "NRIC" ? "Malaysia" : "",
    }));
  };

  // ✅ Generic field handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${apiBaseUrl}/api/member/update/${memberId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onUpdated(); // refresh member list
        onClose(); // close form
      }
    } finally {
      setLoading(false);
    }
  };

  if (!formData) return <div>Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-4 max-h-[80vh] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Edit Member</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Member Type / ID Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Member Type</label>
            <select
              name="memberType"
              value={formData.memberType || ""}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option>Doctor</option>
              <option>Staff</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">ID Type</label>
            <select
              name="idType"
              value={formData.idType || ""}
              onChange={handleIdTypeChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option>NRIC</option>
              <option>Passport</option>
            </select>
          </div>
        </div>

        {/* Row 2: NRIC / Full Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">NRIC</label>
            <input
              type="text"
              name="nric"
              value={formData.nric || ""}
              onChange={handleNricChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="e.g. 991231145678"
            />
          </div>
          <div>
            <label className="block text-sm">Full Name</label>
            <input
              type="text"
              name="fullName1"
              value={formData.fullName1 || ""}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        {/* Row 3: DOB / Gender */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">DOB</label>
            <input
              type="date"
              name="dob"
              value={formData.dob ? formData.dob.split("T")[0] : ""}
              onChange={handleChange}
              readOnly={formData.idType === "NRIC"}
              className={`w-full border px-3 py-2 rounded ${
                formData.idType === "NRIC" ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>
          <div>
            <label className="block text-sm">Gender</label>
            <select
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
        </div>

        {/* Row 4: Nationality / Postal Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Nationality</label>
            <input
              type="text"
              name="nationality"
              value={formData.nationality || ""}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded`}
            />
          </div>
          <div>
            <label className="block text-sm">Postal Code</label>
            <input
              type="text"
              name="postCode"
              value={formData.postCode || ""}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm">Address 1</label>
          <input
            type="text"
            name="address1"
            value={formData.address1 || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm">Address 2</label>
          <input
            type="text"
            name="address2"
            value={formData.address2 || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Row 6: City / State / Country */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm">City</label>
            <input
              type="text"
              name="district"
              value={formData.district || ""}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm">State</label>
            <input
              type="text"
              name="stateName"
              value={formData.stateName || ""}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country || ""}
              onChange={handleChange}
              readOnly={formData.idType === "NRIC"}
              className={`w-full border px-3 py-2 rounded ${
                formData.idType === "NRIC" ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>
        </div>

        {/* Row 7: Email / Phone / Blood */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm">Phone</label>
            <input
              type="text"
              name="pH1"
              value={formData.pH1 || ""}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm">Blood Group</label>
            <input
              type="text"
              name="blood"
              value={formData.blood || ""}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        {/* Remark */}
        <div>
          <label className="block text-sm">Remark</label>
          <textarea
            name="remark"
            value={formData.remark || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            rows={3}
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
