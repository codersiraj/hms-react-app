// src/pages/Dashboard.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import PatientCard from '../components/patient/PatientCard';
import { Patient } from '../types/types';
import PatientList from '../components/patient/PatietList';
import PatientCountWidget from '../components/patient/PatientCountWidget';
import PatientWorkflowWidget from '../components/patient/PatientWorkflowWidget';
import PatientVisitsGraph from '../components/patient/PatientVisitsGraph'; // add this line

export default function Dashboard() {
  const navigate = useNavigate();
  const [nric, setNRIC] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [showCreateButton, setShowCreateButton] = useState(false);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [workflowStatus, setWorkflowStatus] = useState('Checked In');

  const apiBaseUrl = (window as any)._env_?.API_BASE_URL || 'http://localhost:5000';

const handleCheck = async () => {
  setPatient(null);
  setNotFound(false);

  if (!nric.trim()) {
    navigate('/new-appointment');
    return;
  }

  try {
    const checkRes = await fetch(`${apiBaseUrl}/api/patient/check-nric?nric=${nric}`);
    const checkData = await checkRes.json();

    if (checkData.exists) {
      const patientRes = await fetch(`${apiBaseUrl}/api/patient/get-by-nric?nric=${nric}`);
      const patientData = await patientRes.json();
      setPatient(patientData);
      setShowCreateButton(false);
    } else {
      setNotFound(true);
      setShowCreateButton(true);
      setTimeout(() => setShowCreateButton(false), 20000);
      setTimeout(() => setNotFound(false), 4000);
    }
  } catch (error) {
    console.error('Check NRIC failed', error);
  }
};



  const handleCheckIn = () => {
    setShowWorkflow(true);
    setWorkflowStatus('Lab Processing'); // Next step starts blinking
  };


  return (
    <div className="relative min-h-screen bg-gradient-to-r from-cyan-400 to-teal-300 px-4 py-4 overflow-hidden">
      <div className="absolute inset-0 bg-[url('background1.jpg')] bg-cover bg-center opacity-10 z-0" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[0.75fr_1.5fr_1.25fr] gap-4 w-full px-2 items-start">
        {/* Left: Count Widget */}
        <div className="lg:col-span-1 space-y-4">
          <PatientCountWidget />
        </div>

        {/* Middle Column: Search, Patient Card, Workflow Widget */}
        <div className="col-span-1 space-y-4 flex flex-col">
          {/* Search + PatientCard */}
          <div className="bg-white rounded-xl shadow-xl p-4 w-full">
            {/* Input + Check Button in one row */}
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-grow">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <input
                  type="text"
                  placeholder="Enter NRIC / Passport Number"
                  value={nric}
                  onChange={(e) => setNRIC(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm"
                />
              </div>
              <button
                onClick={handleCheck}
                className="bg-cyan-700 hover:bg-cyan-600 text-white text-sm font-medium rounded-md px-4 py-1.5"
              >
                Check
              </button>
            </div>
            {/* Not Found */}
            {notFound && (
              <div className="mt-2 text-center">
                <div className="bg-red-100 text-red-800 px-3 py-1.5 rounded shadow text-sm mb-2">
                  No Patient Record Found
                </div>
                {showCreateButton && (
                  <button
                    onClick={() => navigate('/patient-register')}
                    className="inline-flex items-center justify-center primary-button mt-2"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Create Patient
                  </button>
                )}
              </div>
            )}

            {/* Patient Card */}
            {patient && (
              <div className="mt-2">
                <PatientCard patient={patient} onCheckIn={handleCheckIn} />
              </div>
            )}
          </div>

          {/* Workflow Widget */}
          {patient && showWorkflow && (
            <div className="bg-white rounded-xl shadow-xl p-4 w-full">
              <PatientWorkflowWidget
                patient={patient}
                currentStatus={workflowStatus}
              />
            </div>
          )}
        </div>

        {/* Right: Patient List & Graph */}
        <div className="lg:col-span-1 space-y-4">
          <PatientList />
          <PatientVisitsGraph />
        </div>
      </div>
    </div>
  );
}
