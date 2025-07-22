import React from "react";

export default function PatientDetailsDashboard({
  statusMessage,
}: {
  statusMessage: { text: string; color: "green" | "red" } | null;
}) {
  if (!statusMessage) return null;

  return (
    <div
      className={`text-xl font-semibold text-center py-6 ${
        statusMessage.color === "green" ? "text-green-500" : "text-red-500"
      }`}
    >
      {statusMessage.text}
    </div>
  );
}
    