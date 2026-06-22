import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from '../contextapi/AuthContext';
import AdminLogin from '../admin/AdminLogin';
import DoctorLogin from '../doctor/DoctorLogin';
import DoctorRegister from '../doctor/DoctorRegister';
import PatientLogin from '../patient/PatientLogin';
import PatientRegister from '../patient/PatientRegister';
import Home from './Home';
import About from './About';
import NotFound from './NotFound';
import './main.css';

export default function MainNavBar() {
  const { isAdminLoggedIn, isPatientLoggedIn, isDoctorLoggedIn } = useAuth();

  return (
    <>
      <nav className="main-navbar">
        <div className="main-navbar-container">
          <Link to="/" className="main-navbar-logo">
            🏥 Clinic Management
          </Link>
          
          <div className="main-navbar-links">
            <Link to="/" className="main-navbar-link">Home</Link>
            
            <Link to="/about" className="main-navbar-link">About</Link>
            
            {!isAdminLoggedIn && !isPatientLoggedIn && !isDoctorLoggedIn && (
              <>
                <Link to="/doctorregister" className="main-navbar-link">Register as Doctor</Link>
                
                <Link to="/patientregister" className="main-navbar-link">Register as Patient</Link>
                
                <Link to="/adminlogin" className="main-navbar-link main-navbar-link-button">Admin</Link>
                
                <Link to="/doctorlogin" className="main-navbar-link main-navbar-link-button">Doctor</Link>
                
                <Link to="/patientlogin" className="main-navbar-link main-navbar-link-button">Patient</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/doctorlogin" element={<DoctorLogin />} />
        <Route path="/doctorregister" element={<DoctorRegister />} />
        <Route path="/patientlogin" element={<PatientLogin />} />
        <Route path="/patientregister" element={<PatientRegister />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
