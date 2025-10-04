// src/components/patient/PatientHistoryList.tsx
import React from "react";

type Prescription = {
  medicine: string;
  dosage: string;
  instructions: string;
};

type Visit = {
  id: string;
  date: string;
  reason: string;
  prescriptions: Prescription[];
};

type PatientHistoryListProps = {
  history: Visit[];
};

export default function PatientHistoryList({ history }: PatientHistoryListProps) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-lg font-semibold text-[#00575d] mb-4">Patient History</h3>
      <table className="w-full text-sm text-left min-w-[500px]">
        <thead className="text-[#003366] border-b">
          <tr>
            <th className="py-2">Date</th>
            <th className="py-2">Reason</th>
            <th className="py-2">Prescriptions</th>
          </tr>
        </thead>
        <tbody>
          {history.map((visit) => (
            <tr key={visit.id} className="border-b text-[#1d4e89]">
              <td className="py-2">{new Date(visit.date).toLocaleDateString()}</td>
              <td className="py-2">{visit.reason}</td>
              <td className="py-2">
                {visit.prescriptions.map((p, i) => (
                  <div key={i} className="text-gray-700">
                    {p.medicine} – {p.dosage} ({p.instructions})
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
