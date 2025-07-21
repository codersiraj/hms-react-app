// src/pages/Dashboard.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Settings } from 'lucide-react';
import PatientCard from '../components/patient/PatientCard';
import { Patient } from '../types/types';
import PatientList from '../components/patient/PatietList';
import PatientCountWidget from '../components/patient/PatientCountWidget';
import PatientWorkflowWidget from '../components/patient/PatientWorkflowWidget';
import PatientVisitsGraph from '../components/patient/PatientVisitsGraph';
import StaffForm from '../components/staff/StaffForm';

const USER_ROLE = 'admin'; // Replace with actual role logic

export default function Dashboard() {
  const navigate = useNavigate();
  const [nric, setNRIC] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [showCreateButton, setShowCreateButton] = useState(false);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [workflowStatus, setWorkflowStatus] = useState('Checked In');
  const [activeTab, setActiveTab] = useState<'patient' | 'doctor'>('patient');
  const [showStaffForm, setShowStaffForm] = useState(false);

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
    setWorkflowStatus('Lab Processing');
  };

  const allowedTabs = [];
  if (USER_ROLE === 'admin' || USER_ROLE === 'patient') allowedTabs.push('patient');
  if (USER_ROLE === 'admin' || USER_ROLE === 'doctor') allowedTabs.push('doctor');

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-cyan-400 to-teal-300 px-4 py-4 overflow-hidden">
  <div className="absolute inset-0 bg-[url('background1.jpg')] bg-cover bg-center opacity-10 z-0" />

  {/* Top bar container: settings button on right, tabs centered below */}
  <div className="relative z-10 flex flex-col items-center gap-2">
    {/* Settings button aligned right, full width */}
    <div className="w-full flex justify-end">
      <button
        onClick={() => setShowStaffForm(true)}
        className="text-white hover:text-cyan-200 transition"
        title="Settings"
      >
        <Settings className="w-6 h-6" />
      </button>
    </div>

    {/* Tabs container */}
    <div className="flex gap-4">
      {allowedTabs.includes('patient') && (
        <button
          className={`px-6 py-3 rounded-md font-semibold ${
            activeTab === 'patient'
              ? 'bg-white text-cyan-700 shadow'
              : 'bg-cyan-100 text-cyan-800'
          }`}
          onClick={() => setActiveTab('patient')}
        >
          Patient Dashboard
        </button>
      )}
      {allowedTabs.includes('doctor') && (
        <button
          className={`px-6 py-3 rounded-md font-semibold ${
            activeTab === 'doctor'
              ? 'bg-white text-teal-700 shadow'
              : 'bg-teal-100 text-teal-800'
          }`}
          onClick={() => setActiveTab('doctor')}
        >
          Doctor Dashboard
        </button>
      )}
    </div>
  </div>

      {/* Tab Content */}
      <div className="relative z-10">
        {activeTab === 'patient' && (
          <div className="mt-6 relative z-10 grid grid-cols-1 lg:grid-cols-[0.75fr_1.5fr_1.25fr] gap-4 w-full px-2 items-start">
            <div className="lg:col-span-1 space-y-4">
              <PatientCountWidget />
            </div>

            <div className="col-span-1 space-y-4 flex flex-col">
              <div className="bg-white rounded-xl shadow-xl p-4 w-full">
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative flex-grow">
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

                {patient && (
                  <div className="mt-2">
                    <PatientCard patient={patient} onCheckIn={handleCheckIn} />
                  </div>
                )}
              </div>

              {patient && showWorkflow && (
                <div className="bg-white rounded-xl shadow-xl p-4 w-full">
                  <PatientWorkflowWidget patient={patient} currentStatus={workflowStatus} />
                </div>
              )}
            </div>

            <div className="lg:col-span-1 space-y-4">
              <PatientList />
              <PatientVisitsGraph />
            </div>
          </div>
        )}

        {activeTab === 'doctor' && (
          <div className="text-center text-xl font-semibold text-white py-20">
            Doctor Dashboard (Coming Soon)
          </div>
        )}
      </div>

      {showStaffForm && <StaffForm onClose={() => setShowStaffForm(false)} />}
    </div>
  );
}
