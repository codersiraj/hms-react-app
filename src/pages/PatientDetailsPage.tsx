import React from "react";
import { useParams } from "react-router-dom";
import PatientDetailsCard from "../components/patient/PatientDetailsCard";
import PatientHistoryList from "../components/patient/PatientHistoryList";

export default function PatientDetailsPage() {
  const { id } = useParams();

  return (
    <div className="p-4 bg-[#ebf0f4] min-h-screen">
      <h2 className="text-2xl font-bold text-[#003366] mb-6">
        Patient Details (ID: {id})
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PatientDetailsCard
          patient={{
            id: id || "Unknown",
            name: "Arun Kumar",
            passport: "A1234567",
            lastVisit: "2025-09-01",
          }}
        />
        <PatientHistoryList
          history={[
            {
              id: "V001",
              date: "2025-09-01",
              reason: "Fever & Cold",
              prescriptions: [
                { medicine: "Paracetamol", dosage: "500mg", instructions: "Twice daily" },
              ],
            },
            {
              id: "V002",
              date: "2025-08-15",
              reason: "Diabetes follow-up",
              prescriptions: [
                { medicine: "Metformin", dosage: "500mg", instructions: "Morning & Evening" },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
}
