// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Initialize'; // or ./pages/LoginPage if renamed
import Dashboard from './pages/Dashboard';  // Make sure this file exists
import PatientRegister from './pages/PatientRegister';
import './index.css';
import AdminConsole from './pages/AdminConsole';
import NewAppointment from './pages/NewAppointment';
import MainPage from './pages/MainPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patient-register" element={<PatientRegister />} />
        <Route path="/adminconsole" element={<AdminConsole />} />
        <Route path="/new-appointment" element={<NewAppointment />} />
      </Routes>
    </Router>
  );
}

export default App;