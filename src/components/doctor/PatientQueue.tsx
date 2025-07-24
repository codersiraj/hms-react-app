// src/components/doctor/PatientQueue.tsx
import React, { useEffect, useState } from 'react';
import PrescriptionModal, { Prescription } from './PrescriptionModal';

type Patient = {
  id: string;
  name: string;
  time: string;
};

export default function PatientQueue() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPrescriptions, setSelectedPrescriptions] = useState<Prescription[]>([]);

  const fetchQueue = async () => {
    const res = await fetch(`${(window as any)._env_?.API_BASE_URL || 'http://localhost:5000'}/api/doctor/patient-queue`);
    const data = await res.json();
    setPatients(data);
  };

  const handleViewPrescriptions = async (patientId: string) => {
    const res = await fetch(`${(window as any)._env_?.API_BASE_URL || 'http://localhost:5000'}/api/prescriptions/${patientId}`);
    const data = await res.json();
    setSelectedPrescriptions(data);
    setModalOpen(true);
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h3 className="text-lg font-semibold text-[#00575d] mb-4">Today's Patient Queue</h3>
      <ul className="space-y-3">
        {patients.map((p) => (
          <li key={p.id} className="flex justify-between items-center border-b pb-2">
            <div>
              <p className="font-medium text-[#1d4e89]">{p.name}</p>
              <p className="text-sm text-gray-500">{p.time}</p>
            </div>
            <button
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 text-sm rounded"
              onClick={() => handleViewPrescriptions(p.id)}
            >
              View Prescription
            </button>
          </li>
        ))}
      </ul>

      <PrescriptionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        prescriptions={selectedPrescriptions}
      />
    </div>
  );
}
