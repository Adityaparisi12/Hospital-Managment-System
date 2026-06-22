import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './patient.css';
import PatientHome from './PatientHome';
import PatientProfile from './PatientProfile';
import PatientAppointments from './PatientAppointments';
import PatientPrescriptions from './PatientPrescriptions';
import { useAuth } from '../contextapi/AuthContext';

export default function PatientNavBar() {
  const navigate = useNavigate();
  const { setIsPatientLoggedIn, setPatientData, patientData } = useAuth();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      setIsPatientLoggedIn(false);
      setPatientData(null);
      localStorage.removeItem('patient');
      navigate('/patientlogin');
    }
  };

  // Get first letter of patient name for avatar
  const getAvatarLetter = () => {
    if (patientData?.name) {
      return patientData.name.charAt(0).toUpperCase();
    }
    const storedPatient = localStorage.getItem('patient');
    if (storedPatient) {
      const patient = JSON.parse(storedPatient);
      return patient.name?.charAt(0).toUpperCase() || 'P';
    }
    return 'P';
  };

  return (
    <div>
      <div className="patient-navbar">
        <nav>
          <div className="nav-brand">🏥 HMS Patient Portal</div>
          <div className="nav-links">
            <Link to="/patienthome">Dashboard</Link>
            <Link to="/patientappointments">Appointments</Link>
            <Link to="/patientprescriptions">Prescriptions</Link>
            <Link to="/patientprofile">My Profile</Link>
          </div>
          <div className="nav-user">
            <div className="user-avatar">{getAvatarLetter()}</div>
            <button onClick={handleLogout} className="btn-secondary" style={{ padding: '10px 20px' }}>
              🚪 Logout
            </button>
          </div>
        </nav>
      </div>

      <Routes>
        <Route path="/patienthome" element={<PatientHome/>}/>
        <Route path="/patientappointments" element={<PatientAppointments/>}/>
        <Route path="/patientprescriptions" element={<PatientPrescriptions/>}/>
        <Route path="/patientprofile" element={<PatientProfile/>}/>
      </Routes>
    </div>
  );
}
