import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PatientRegister from "./pages/PatientRegister";
import "./index.css";
import AdminConsole from "./pages/AdminConsole";
import NewAppointment from "./pages/NewAppointment";
import MainPage from "./pages/MainPage";
import PatientDetailsPage from "./pages/PatientDetailsPage";
import Layout from "./components/layout/Layout";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import Login from "./pages/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MemberList from "./pages/MemberList";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Login page */}
        <Route path="/login" element={<Login />} />

        {/* ✅ Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<MainPage />} />
            <Route path="patient-dashboard" element={<PatientDashboard />} />
            <Route path="member-list" element={<MemberList />} />
            <Route path="doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="patient-register" element={<PatientRegister />} />
            <Route path="adminconsole" element={<AdminConsole />} />
            <Route path="new-appointment" element={<NewAppointment />} />
            <Route path="patient/:id" element={<PatientDetailsPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
