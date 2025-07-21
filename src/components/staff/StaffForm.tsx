// src/components/staff/StaffForm.tsx

import React, { useState } from 'react';

const apiBaseUrl = (window as any)._env_?.API_BASE_URL || 'http://localhost:5000';

export default function StaffForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    StaffID: '',
    StaffType: '',
    StaffName1: '',
    StaffName2: '',
    Blood: '',
    DOB: '',
    ICType: '',
    NRIC: '',
    Nationality: '',
    Religion: '',
    Race: '',
    LangKnown: '',
    Address1: '',
    Address2: '',
    Address3: '',
    Address4: '',
    StateName: '',
    Country: '',
    PostCode: '',
    PH1: '',
    PH2: '',
    Email: '',
    Degree: '',
    Certificate: '',
    isOnlineConsult: false,
    Dated: new Date().toISOString().split('T')[0],
    isNew: true,
    isSync: false,
    Life: 'Y',
    CreatedBy: 'admin',
    UpdatedBy: 'admin',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const target = e.target;

  if (target instanceof HTMLInputElement && target.type === 'checkbox') {
    // It's a checkbox input
    setForm(prev => ({
      ...prev,
      [target.name]: target.checked,
    }));
  } else {
    // It's a normal input or select
    setForm(prev => ({
      ...prev,
      [target.name]: target.value,
    }));
  }
};



  const handleSubmit = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/staff/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to create staff');
      alert('Staff created successfully');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to create staff');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-3xl h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create New Staff</h2>
          <button onClick={onClose} className="text-red-500 font-bold">✖</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {Object.entries(form).map(([key, value]) =>
            typeof value === 'boolean' ? (
              <label key={key} className="col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  name={key}
                  checked={value}
                  onChange={handleChange}
                />
                {key}
              </label>
            ) : (
              <input
                key={key}
                name={key}
                placeholder={key}
                type={key === 'DOB' || key === 'Dated' ? 'date' : 'text'}
                value={value}
                onChange={handleChange}
                className="input border px-2 py-1 rounded"
              />
            )
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="mt-4 bg-cyan-700 text-white px-6 py-2 rounded-md hover:bg-cyan-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
