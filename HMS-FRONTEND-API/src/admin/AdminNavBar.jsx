import React from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './admin.css';
import AdminHome from './AdminHome';
import AdminDoctor from './AdminDoctor';
import AdminPatient from './AdminPatient';
import AdminPrescription from './AdminPrescription';
import { useAuth } from '../contextapi/AuthContext';

export default function AdminNavBar() {
  const navigate = useNavigate();
  const { setIsAdminLoggedIn } = useAuth();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      setIsAdminLoggedIn(false);
      navigate('/adminlogin');
    }
  };

  return (
    <div>
      <div className="admin-navbar">
        <nav>
          <div className="nav-brand">🏥 CMS Admin</div>
          <div className="nav-links">
            <Link to="/adminhome">Dashboard</Link>
            <Link to="/admindoctor">Doctors</Link>
            <Link to="/adminpatient">Patients</Link>
            <Link to="/adminprescription">Prescriptions</Link>
          </div>
          <div className="nav-user">
            <div className="user-avatar">A</div>
            <button onClick={handleLogout} className="btn-secondary" style={{ padding: '10px 20px' }}>
              🚪 Logout
            </button>
          </div>
        </nav>
      </div>

      <Routes>
        <Route path="/adminhome" element={<AdminHome/>}/>
        <Route path="/admindoctor" element={<AdminDoctor/>}/>
        <Route path="/adminpatient" element={<AdminPatient/>}/>
        <Route path="/adminprescription" element={<AdminPrescription/>}/>
      </Routes>
    </div>
  )
}
