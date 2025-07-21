import Layout from '../components/layout/Layout';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';

export default function MainPage() {
  return (
    <Layout>
      {(activeTab) => (
        <>
          {activeTab === 'patient' && <PatientDashboard />}
          {activeTab === 'doctor' && <DoctorDashboard />}
        </>
      )}
    </Layout>
  );
}
