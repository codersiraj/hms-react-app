import React from 'react';

type FormFieldProps = {
  type?: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  required?: boolean;
  error?: string;
  options?: string[]; // only used for select
};

export const FormInput: React.FC<FormFieldProps> = ({
  type = 'text',
  name,
  label,
  value,
  onChange,
  required = false,
  error,
}) => (
  <div className="w-full md:w-1/2 px-2 mb-4">
    <label className="block text-sm text-cyan-700 font-semibold mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-cyan-400 outline-none"
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

export const FormSelect: React.FC<FormFieldProps> = ({
  name,
  label,
  value,
  onChange,
  required = false,
  error,
  options = [],
}) => (
  <div className="w-full md:w-1/2 px-2 mb-4">
    <label className="block text-sm text-cyan-700 font-semibold mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-cyan-400 outline-none"
    >
      <option value="">Select {label}</option>
      {options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);
