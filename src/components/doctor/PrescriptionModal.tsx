// src/components/doctor/PrescriptionModal.tsx
import React from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

export type Prescription = {
  medicine: string;
  dosage: string;
  instructions: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  prescriptions: Prescription[];
};

const PrescriptionModal: React.FC<Props> = ({ isOpen, onClose, prescriptions }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen bg-black/50 p-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-bold text-gray-800">Prescription History</Dialog.Title>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-3">
            {prescriptions.map((p, i) => (
              <div key={i} className="bg-gray-50 p-3 rounded border border-gray-200">
                <p className="text-sm text-gray-800"><strong>Medicine:</strong> {p.medicine}</p>
                <p className="text-sm text-gray-600"><strong>Dosage:</strong> {p.dosage}</p>
                <p className="text-sm text-gray-600"><strong>Instructions:</strong> {p.instructions}</p>
              </div>
            ))}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default PrescriptionModal;
