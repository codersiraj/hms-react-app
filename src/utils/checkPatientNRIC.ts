// src/utils/checkPatientNRIC.ts
import { Patient } from '../types/types';

const apiBaseUrl = (window as any)._env_?.API_BASE_URL || 'http://localhost:5000';

export async function checkPatientNRIC(nric: string): Promise<{
  exists: boolean;
  patient?: Patient;
}> {
  try {
    const checkRes = await fetch(`${apiBaseUrl}/api/patient/check-nric?nric=${nric}`);
    const checkData = await checkRes.json();

    if (checkData.exists) {
      const patientRes = await fetch(`${apiBaseUrl}/api/patient/get-by-nric?nric=${nric}`);
      const patientData = await patientRes.json();
      return { exists: true, patient: patientData };
    } else {
      return { exists: false };
    }
  } catch (error) {
    console.error('Error checking NRIC:', error);
    throw error;
  }
}
