import React from 'react';
import { Patient } from '../../types/types';

export default function PatientCard({
  patient,
  onCheckIn,
}: {
  patient: Patient;
  onCheckIn: () => void;
}) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-inner mb-0">
      <h3 className="text-base font-semibold text-cyan-700">Patient Details</h3>
      <div className="text-sm text-gray-800 space-y-1">
        <div><strong>Name:</strong> {patient.patientName}</div>
        <div><strong>NRIC:</strong> {patient.nric}</div>
        <div><strong>IC Type:</strong> {patient.icType}</div>
        <div><strong>Blood Group:</strong> {patient.bloodGroup || '-'}</div>
      </div>

      <button
        className="mt-4 px-4 py-2 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-700"
        onClick={onCheckIn}
      >
        Check In
      </button>
    </div>
  );
}

