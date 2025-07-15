import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Doctor {
  doctorId: number;
  fullName: string;
  specialization: string;
  availability: string;
}

// ✅ Use runtime environment variable
const API_BASE_URL = (window as any)._env_?.API_BASE_URL || 'http://localhost:5000';

export default function NewAppointment() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/doctors`);
      if (!res.ok) throw new Error('Failed to fetch doctors');
      const data = await res.json();
      setDoctors(data);
      setFilteredDoctors(data);
    } catch (err: any) {
      console.error(err);
      setError('Could not load doctors.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter(doc =>
        doc.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDoctors(filtered);
    }
  }, [searchTerm, doctors]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-400 to-teal-300 px-4 py-6 relative">
      <div className="absolute inset-0 bg-[url('background1.jpg')] bg-cover bg-center opacity-10 z-0" />
      <div className="relative z-10 max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-cyan-800">New Appointment</h1>

        {/* Action buttons */}
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <button
            onClick={handleSearch}
            className="bg-cyan-700 hover:bg-cyan-600 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Search Available Doctors
          </button>
          <input
            type="text"
            placeholder="Search by name or specialization"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md p-2 text-sm flex-grow min-w-[200px]"
          />
          <button
            onClick={() => navigate('/')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Status */}
        {loading && <p className="text-sm text-gray-600">Loading...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* Doctor cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doc) => (
              <div
                key={doc.doctorId}
                className="border rounded-lg p-4 shadow hover:shadow-md transition bg-white"
              >
                <h2 className="text-lg font-semibold text-gray-800">{doc.fullName}</h2>
                <p className="text-sm text-gray-600">Specialization: {doc.specialization || 'General'}</p>
                <p className="text-sm text-green-700">Availability: {doc.availability || 'Available'}</p>
              </div>
            ))
          ) : (
            !loading && <p className="text-sm text-gray-500 col-span-full">No doctors found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
