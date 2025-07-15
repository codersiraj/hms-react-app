import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Patient {
  patientId: number;
  patientName: string;
  nric: string;
  icType: string;
  bloodGroup?: string;
}

const API_BASE_URL =
  (window as any)._env_?.API_BASE_URL
    ? `${(window as any)._env_.API_BASE_URL}/api/patient`
    : 'http://localhost:5000/api/patient';

const ITEMS_PER_PAGE = 5;

export default function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/getallpatients`)
      .then(response => setPatients(response.data))
      .catch(error => console.error('Error fetching patient list:', error))
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(patients.length / ITEMS_PER_PAGE);
  const paginatedPatients = patients.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 0));
  const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-auto flex flex-col text-sm">
      <h3 className="text-base font-semibold text-cyan-700">Patient List</h3>

      {loading ? (
        <p className="text-gray-500">Loading patients...</p>
      ) : patients.length === 0 ? (
        <p className="text-gray-500">No patients found.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200 pr-2">
            {paginatedPatients.map(patient => (
              <li key={patient.patientId} className="py-2">
                <div className="text-gray-800 font-medium">{patient.patientName}</div>
                <div className="text-xs text-gray-600">
                  {patient.icType}: {patient.nric}
                  {patient.bloodGroup && ` | ${patient.bloodGroup}`}
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination Controls */}
          <div className="mt-3 flex justify-center gap-4 items-center">
            <button
              onClick={handlePrev}
              disabled={currentPage === 0}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-cyan-500 text-white hover:bg-cyan-600 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-cyan-500 text-white hover:bg-cyan-600 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
