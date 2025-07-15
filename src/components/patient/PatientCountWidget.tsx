import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users } from 'lucide-react';

const API_BASE_URL =
  (window as any)._env_?.API_BASE_URL
    ? `${(window as any)._env_.API_BASE_URL}/api/patient`
    : 'http://localhost:5000/api/patient';

export default function PatientCountWidget() {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/getallpatients`)
      .then(res => {
        setCount(res.data.length);
      })
      .catch(err => {
        console.error('Failed to fetch patient count:', err);
      });
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between w-full max-w-xs">
      <div>
        <p className="text-sm text-gray-500">Total Patients</p>
        <p className="text-2xl font-semibold text-cyan-700">{count}</p>
      </div>
      <Users className="h-8 w-8 text-cyan-600" />
    </div>
  );
}
