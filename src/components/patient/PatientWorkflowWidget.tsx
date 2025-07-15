import React from 'react';
import { Patient } from '../../types/types';
import { Tooltip } from 'react-tooltip';

interface Props {
  patient: Patient;
  currentStatus: string;
}

const steps = [
  'Checked In',
  'Waiting for Consultation',
  'Consulting',
  'Lab Processing',
  'Reconsulting',
  'Pharmacy',
  'Checked Out',
];

export default function PatientWorkflowWidget({ patient, currentStatus }: Props) {
  const currentStepIndex = Math.max(steps.indexOf(currentStatus), 0);
  const stepCount = steps.length;
  const totalSegments = stepCount - 1.90;
  const completedSegments = Math.max(currentStepIndex, 0);

  // Calculate % offset to start/end between circles
  const offsetPercent = 100 / (stepCount * 2);
  const progressPercent = (completedSegments / totalSegments) * (100 - 2 * offsetPercent);

  return (
    <div className="col-span-full mt-4 bg-white rounded-xl shadow-md p-4">
      <div className="mb-2 border-b pb-1">
        <h3 className="text-base font-semibold text-cyan-700">Workflow Progress</h3>
        <p className="text-xs text-gray-600">{patient.patientName} ({patient.nric})</p>
      </div>

      {/* Progress Track and Green Line */}
      <div className="relative flex items-center justify-between mt-6 px-2">
        {/* Gray Track with Green Progress inside */}
        <div
          className="absolute top-1/2 h-1 bg-gray-300 rounded z-0 left-0 right-0 overflow-hidden"
          style={{
            marginLeft: `${offsetPercent}%`,
            marginRight: `${offsetPercent}%`,
          }}
        >
          <div
            className="h-1 bg-green-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Workflow Step Dots */}
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div
              key={step}
              className="relative z-10 flex flex-col items-center w-full group"
            >
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold transition-all duration-300
                ${isCompleted
                    ? 'bg-green-500 text-white'
                    : isCurrent
                      ? 'border-2 border-red-500 text-red-500 animate-pulse bg-white shadow shadow-red-200'
                      : 'border border-gray-400 text-gray-500 bg-white'}
              `}
                data-tooltip-id={`tooltip-${index}`}
                data-tooltip-content={step}
              >
                {isCompleted ? '✓' : index + 1}
              </div>

              <Tooltip
                id={`tooltip-${index}`}
                place="top"
                className="z-50"
                style={{ fontSize: '10px' }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
