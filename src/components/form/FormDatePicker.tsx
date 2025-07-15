// src/components/FormDatePicker.tsx
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/datepicker-custom.css';

interface FormDatePickerProps {
    name: string;
    label: string;
    value: Date | null;
    onChange: (name: string, date: Date | null) => void;
    required?: boolean;
    error?: string;
}

export const FormDatePicker: React.FC<FormDatePickerProps> = ({
    name,
    label,
    value,
    onChange,
    required = false,
    error,
}) => {
    return (
        <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="block text-sm text-cyan-700 font-semibold mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <DatePicker
                selected={value}
                onChange={(date) => onChange(name, date)}
                dateFormat="dd-MM-yyyy"
                placeholderText="dd-mm-yyyy"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-400 outline-none"
                calendarClassName="custom-calendar"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select" // 👈 this ensures dropdown appears only on click
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
};
