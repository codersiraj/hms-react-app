// src/pages/MainPage.tsx
import PatientDashboard from "./PatientDashboard";
import DoctorDashboard from "./DoctorDashboard";

export default function MainPage() {
  // For now just show PatientDashboard by default
  // Later you can make this conditional via Redux, Context, or URL (/doctor etc.)
  return <PatientDashboard />; 
}
