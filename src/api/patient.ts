import axios from 'axios';

const API_BASE_URL =
  (window as any)._env_?.API_BASE_URL
    ? `${(window as any)._env_.API_BASE_URL}/api/patient`
    : 'http://localhost:5000/api/patient';

export const createPatient = async (patientData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create`, patientData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
