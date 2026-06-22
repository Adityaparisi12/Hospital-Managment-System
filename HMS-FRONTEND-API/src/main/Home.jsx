import React from 'react';
import { Link } from 'react-router-dom';
import './main.css';

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">
          Welcome to Clinic Management System
        </h1>
        <p className="home-subtitle">
          Streamlining healthcare management for administrators, doctors, and patients
        </p>
        
        <div className="home-cards-grid">
          <div className="home-card">
            <h3 className="home-card-title">👨‍⚕️ For Doctors</h3>
            <p className="home-card-description">Manage appointments and prescriptions</p>
            <Link to="/doctorlogin" className="home-card-link">
              Doctor Login
            </Link>
          </div>

          <div className="home-card">
            <h3 className="home-card-title">🧑‍💼 For Admin</h3>
            <p className="home-card-description">Oversee clinic operations</p>
            <Link to="/adminlogin" className="home-card-link">
              Admin Login
            </Link>
          </div>

          <div className="home-card">
            <h3 className="home-card-title">🏥 For Patients</h3>
            <p className="home-card-description">Book appointments and view records</p>
            <Link to="/patientlogin" className="home-card-link">
              Patient Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
