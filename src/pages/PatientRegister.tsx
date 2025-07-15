import React, { useState } from 'react';
import { IC_TYPES, RACES } from '../utils/dropdownOptions';
import { FormInput, FormSelect } from '../components/form/FormField';
import { FormDatePicker } from '../components/form/FormDatePicker';
import { createPatient } from '../api/patient';

type FormDataType = {
  [key: string]: string;
};

export default function PatientRegister() {
  const [formData, setFormData] = useState<FormDataType>({
    PatientName: '', BloodGroup: '', ICType: '', NRIC: '',
    Nationality: '', Religion: '', Race: '', Language: '',
    Address1: '', Address2: '', Address3: '', State: '', Country: '',
    PinCode: '', PH1: '', PH2: '', RelativeID1: '', RelativeName1: '',
    Relationship1: '', RelativeID2: '', RelativeName2: '', Relationship2: '', EMail: ''
  });

  const [dob, setDob] = useState<Date | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };
  

  const validate = () => {
    const requiredFields = ['PatientName', 'ICType', 'NRIC'];

    const newErrors: { [key: string]: string } = {};
    requiredFields.forEach(field => {
      if (!formData[field]) newErrors[field] = 'This field is required';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const finalData = {
      ...formData,
      DOB: dob
    };
    try {
      const response = await createPatient(finalData);
      console.log('Patient created:', response);
      alert('Patient Registered Successfully!');
    } catch (error: any) {
      console.error('Error creating patient:', error);
      alert('Failed to register patient. Please try again.');
    }
  }
  };

  return (
    <div className="relative min-h-screen bg-page px-4 py-10 overflow-hidden">
      <div className="absolute inset-0 bg-[url('background1.jpg')] bg-cover bg-center opacity-10 z-0" />

      <form
        className="relative bg-white rounded-xl shadow-xl p-8 w-full max-w-6xl mx-auto z-10 space-y-6"
        onSubmit={handleSubmit}
      >
        <h2 className="center">Patient Registration</h2>

        {/* Patient Info */}
        <div>
          <h3>Patient Information</h3>
          <div className="flex flex-wrap -mx-2">
            <FormInput name="PatientName" label="Patient Name" value={formData.PatientName} onChange={handleChange} required error={errors.PatientName} />
            <FormInput name="BloodGroup" label="Blood Group" value={formData.BloodGroup} onChange={handleChange} />
            <FormDatePicker name="DOB" label="Date of Birth" value={dob} onChange={(name, date) => { setDob(date); setErrors(prev => ({ ...prev, [name]: '' })); }} />
            <FormSelect name="ICType" label="IC Type" options={IC_TYPES} value={formData.ICType} onChange={handleChange} required error={errors.ICType} />
            <FormInput name="NRIC" label="NRIC / ID Number" value={formData.NRIC} onChange={handleChange} required error={errors.NRIC} />
            <FormInput name="Nationality" label="Nationality" value={formData.Nationality} onChange={handleChange} />
            <FormInput name="Religion" label="Religion" value={formData.Religion} onChange={handleChange} />
            <FormSelect name="Race" label="Race" options={RACES} value={formData.Race} onChange={handleChange} />
            <FormInput name="Language" label="Language" value={formData.Language} onChange={handleChange} />
            <FormInput name="Address1" label="Address Line 1" value={formData.Address1} onChange={handleChange} />
            <FormInput name="Address2" label="Address Line 2" value={formData.Address2} onChange={handleChange} />
            <FormInput name="Address3" label="Address Line 3" value={formData.Address3} onChange={handleChange} />
            <FormInput name="State" label="State" value={formData.State} onChange={handleChange} />
            <FormInput name="Country" label="Country" value={formData.Country} onChange={handleChange} />
            <FormInput name="PinCode" label="Pin Code" type="number" value={formData.PinCode} onChange={handleChange} />
            <FormInput name="PH1" label="Phone Number 1" type="number" value={formData.PH1} onChange={handleChange} />
            <FormInput name="PH2" label="Phone Number 2" type="number" value={formData.PH2} onChange={handleChange} />
            <FormInput name="EMail" label="Email" value={formData.EMail} onChange={handleChange} />
          </div>

        </div>

        {/* Relative Info */}
        <div>
          <h3>Relative Information</h3>
          <div className="flex flex-wrap -mx-2">
            <FormInput name="RelativeID1" label="Relative ID 1" value={formData.RelativeID1} onChange={handleChange} />
            <FormInput name="RelativeName1" label="Relative Name 1" value={formData.RelativeName1} onChange={handleChange} />
            <FormInput name="Relationship1" label="Relationship 1" value={formData.Relationship1} onChange={handleChange} />
            <FormInput name="RelativeID2" label="Relative ID 2" value={formData.RelativeID2} onChange={handleChange} />
            <FormInput name="RelativeName2" label="Relative Name 2" value={formData.RelativeName2} onChange={handleChange} />
            <FormInput name="Relationship2" label="Relationship 2" value={formData.Relationship2} onChange={handleChange} />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-cyan-600 text-white py-3 rounded-md tracking-wider font-semibold hover:bg-cyan-700 transition"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
