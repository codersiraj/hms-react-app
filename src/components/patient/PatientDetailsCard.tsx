    import React from "react";

export type PatientDetails = {
  id: string;
  name: string;
  passport: string | null;
  lastVisit: string | null; // ISO string (e.g., "2025-09-01")
  avatarUrl?: string;
};

type Props = {
  patient: PatientDetails;
  className?: string;
};

const fmt = (d: string | null) =>
  d ? new Date(d).toLocaleDateString() : "—";

const PatientDetailsCard: React.FC<Props> = ({ patient, className }) => {
  return (
    <div className={`bg-white rounded-2xl shadow p-6 ${className ?? ""}`}>
      <h3 className="text-lg font-semibold text-[#00575d] mb-4">Patient Details</h3>

      <div className="flex items-center gap-4 mb-4">
        <img
          src={patient.avatarUrl ?? "https://i.pravatar.cc/120?img=64"}
          alt={patient.name}
          className="w-16 h-16 rounded-full border-2 border-[#003366] object-cover"
        />
        <div>
          <p className="text-xl font-bold text-[#1d4e89]">{patient.name}</p>
          <p className="text-xs text-gray-500">Patient ID: {patient.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
        <div>
          <span className="font-medium text-[#1d4e89]">Passport No:</span>{" "}
          {patient.passport || "—"}
        </div>
        <div>
          <span className="font-medium text-[#1d4e89]">Last Visit:</span>{" "}
          {fmt(patient.lastVisit)}
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsCard;
