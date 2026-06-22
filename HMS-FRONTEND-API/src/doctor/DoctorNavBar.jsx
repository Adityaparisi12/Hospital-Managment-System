import React from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './doctor.css';
import DoctorHome from './DoctorHome';
import DoctorProfile from './DoctorProfile';
import ViewAppointment from './ViewAppointment';
import DoctorAddPrescription from './DoctorAddPrescription';
import { useAuth } from '../contextapi/AuthContext';

export default function DoctorNavBar() {
  const navigate = useNavigate();
  const { setIsDoctorLoggedIn } = useAuth();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      // Clear doctor data from localStorage
      localStorage.removeItem('doctor');
      setIsDoctorLoggedIn(false);
      navigate('/doctorlogin');
    }
  };

  return (
    <div>
      <div className="doctor-navbar">
        <nav>
          <div className="nav-brand">👨‍⚕️ HMS Doctor</div>
          <div className="nav-links">
            <Link to="/doctorhome">Dashboard</Link>
            <Link to="/doctorprofile">Profile</Link>
            <Link to="/viewappointment">Appointments</Link>
            <Link to="/addprescription">Add Prescription</Link>
          </div>
          <div className="nav-user">
            <div className="user-avatar">D</div>
            <button onClick={handleLogout} className="btn-secondary" style={{ padding: '10px 20px' }}>
              🚪 Logout
            </button>
          </div>
        </nav>
      </div>

      <Routes>
        <Route path="/doctorhome" element={<DoctorHome/>}/>
        <Route path="/doctorprofile" element={<DoctorProfile/>}/>
        <Route path="/viewappointment" element={<ViewAppointment/>}/>
        <Route path="/addprescription" element={<DoctorAddPrescription/>}/>
      </Routes>
    </div>
  )
}
