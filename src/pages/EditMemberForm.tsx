import React, { useEffect, useState } from "react";

interface EditMemberFormProps {
  memberId: string;
  onClose: () => void;
  onUpdated: () => void;
}

const apiBaseUrl = (window as any)._env_?.API_BASE_URL || 'https://localhost:7181';

export default function EditMemberForm({ memberId, onClose, onUpdated }: EditMemberFormProps) {
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 🔑 Fetch member by ID
  useEffect(() => {
    const fetchMember = async () => {
      const res = await fetch(`${apiBaseUrl}/api/member/${memberId}`);
      const data = await res.json();
      setFormData(data);
    };
    fetchMember();
  }, [memberId]);

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
        onClose();   // close form
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
        {/* Row 1 */}
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
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option>NRIC</option>
              <option>Passport</option>
            </select>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">NRIC</label>
            <input
              type="text"
              name="nric"
              value={formData.nric || ""}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
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

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">DOB</label>
            <input
              type="date"
              name="dob"
              value={formData.dob ? formData.dob.split("T")[0] : ""}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
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

        {/* Row 4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Nationality</label>
            <input
              type="text"
              name="nationality"
              value={formData.nationality || ""}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
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
        <div>
          <label className="block text-sm">Address 3</label>
          <input
            type="text"
            name="address3"
            value={formData.address3 || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Row 6 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm">District</label>
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
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        {/* Row 7 */}
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
