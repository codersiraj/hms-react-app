const statuses = [
  'Checked In',
  'Waiting for Consultation',
  'Consulting',
  'Lab Processing',
  'Reconsulting',
  'Pharmacy',
  'Checked Out',
];

export default function WorkflowTracker({ currentStatus }: { currentStatus: string }) {
  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow">
      <h4 className="font-semibold text-cyan-700 mb-3">Patient Workflow</h4>
      <div className="flex flex-wrap gap-2 text-sm">
        {statuses.map((status, index) => (
          <div
            key={index}
            className={`px-3 py-1 rounded-full border ${
              status === currentStatus
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {status}
          </div>
        ))}
      </div>
    </div>
  );
}
