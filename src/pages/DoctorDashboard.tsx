// src/pages/DoctorDashboard.tsx

import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

const doctor = {
  name: "Dr. Rajeev Menon",
  specialty: "General Medicine",
  department: "General",
  experience: "12 Years",
  timings: "Mon - Fri, 9:00 AM - 4:00 PM",
  profileImage: "https://randomuser.me/api/portraits/men/45.jpg",
};

const patientQueue = [
  { id: "1", name: "Arun Kumar", token: "T001", status: "Waiting" },
  { id: "2", name: "Meena Devi", token: "T002", status: "In Consultation" },
  { id: "3", name: "Ravi Teja", token: "T003", status: "Waiting" },
  { id: "4", name: "Sara Khan", token: "T004", status: "Completed" },
];

const todayAppointments = [
  {
    time: "09:00 AM",
    name: "Arun Kumar",
    age: 32,
    reason: "Fever & Cold",
    status: "Scheduled",
  },
  {
    time: "10:00 AM",
    name: "Sangeetha Raj",
    age: 28,
    reason: "Pregnancy Check-up",
    status: "In Progress",
  },
  {
    time: "11:00 AM",
    name: "David John",
    age: 40,
    reason: "Follow-up: Diabetes",
    status: "Completed",
  },
];

type Prescription = {
  medicine: string;
  dosage: string;
  instructions: string;
};

export default function DoctorDashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>("");

  const handleViewPrescription = async (patientId: string) => {
    // Mock API call – replace with real fetch if needed
    const mockPrescriptions: Prescription[] = [
      {
        medicine: "Paracetamol",
        dosage: "500mg",
        instructions: "Twice daily after meals",
      },
      {
        medicine: "Amoxicillin",
        dosage: "250mg",
        instructions: "Three times a day",
      },
    ];
    setPrescriptions(mockPrescriptions);
    setSelectedPatient(patientId);
    setModalOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white min-h-screen">
      {/* Doctor Profile Widget */}
      <div className="bg-white shadow rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 mb-6">
        <img
          src={doctor.profileImage}
          alt="Doctor Profile"
          className="w-32 h-32 rounded-full border-4 border-[#003366] object-cover"
        />
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold text-[#1d4e89]">{doctor.name}</h3>
          <p className="text-gray-600">{doctor.specialty}</p>
          <p className="text-sm text-[#003366] mt-1">
            {doctor.department} Department
          </p>
          <div className="mt-4 text-sm text-gray-700 space-y-1">
            <p>
              <span className="font-medium text-[#1d4e89]">Experience:</span>{" "}
              {doctor.experience}
            </p>
            <p>
              <span className="font-medium text-[#1d4e89]">
                Consultation Hours:
              </span>{" "}
              {doctor.timings}
            </p>
          </div>
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6 overflow-x-auto">
        <h3 className="text-lg font-semibold text-[#00575d] mb-4">
          Today's Appointments
        </h3>
        <table className="w-full text-sm text-left min-w-[600px]">
          <thead className="text-[#003366] border-b">
            <tr>
              <th className="py-2">Time</th>
              <th className="py-2">Patient</th>
              <th className="py-2">Age</th>
              <th className="py-2">Reason</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {todayAppointments.map((apt, index) => (
              <tr key={index} className="border-b text-[#1d4e89]">
                <td className="py-2">{apt.time}</td>
                <td className="py-2">{apt.name}</td>
                <td className="py-2">{apt.age}</td>
                <td className="py-2">{apt.reason}</td>
                <td className="py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      apt.status === "Scheduled"
                        ? "bg-yellow-100 text-yellow-700"
                        : apt.status === "In Progress"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {apt.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Patient Queue */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6 overflow-x-auto border border-[#73d2de]">
        <h3 className="text-lg font-semibold text-[#00575d] mb-4">
          Patient Queue
        </h3>
        <table className="w-full text-sm text-left min-w-[500px]">
          <thead className="text-[#003366] border-b">
            <tr>
              <th className="py-2">Token</th>
              <th className="py-2">Patient Name</th>
              <th className="py-2">Status</th>
              <th className="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {patientQueue.map((patient, index) => (
              <tr key={index} className="border-b text-[#1d4e89]">
                <td className="py-2">{patient.token}</td>
                <td className="py-2">{patient.name}</td>
                <td className="py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      patient.status === "Waiting"
                        ? "bg-yellow-100 text-yellow-700"
                        : patient.status === "In Consultation"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {patient.status}
                  </span>
                </td>
                <td className="py-2">
                  <button
                    onClick={() => handleViewPrescription(patient.id)}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 text-xs rounded"
                  >
                    View Prescription
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Prescription Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen bg-black/50 p-4">
          <Dialog.Panel className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-bold text-gray-800">
                Prescriptions – Patient #{selectedPatient}
              </Dialog.Title>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {prescriptions.map((p, i) => (
                <div
                  key={i}
                  className="bg-gray-50 p-3 rounded border border-gray-200"
                >
                  <p className="text-sm text-gray-800">
                    <strong>Medicine:</strong> {p.medicine}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Dosage:</strong> {p.dosage}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Instructions:</strong> {p.instructions}
                  </p>
                </div>  
              ))}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
