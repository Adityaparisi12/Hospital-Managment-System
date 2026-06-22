import React from 'react';
import './main.css';

export default function About() {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1 className="about-title">
          About Our System
        </h1>
        
        <p className="about-description">
          The Clinic Management System is a comprehensive solution designed to streamline 
          healthcare operations and improve patient care. Our system provides integrated tools 
          for administrators, doctors, and patients.
        </p>

        <div className="about-section">
          <h3 className="about-section-title">Key Features:</h3>
          <ul className="about-features-list">
            <li>
              ✅ Efficient appointment scheduling and management
            </li>
            <li>
              ✅ Digital prescription management
            </li>
            <li>
              ✅ Secure patient record storage
            </li>
            <li>
              ✅ Real-time communication between doctors and patients
            </li>
            <li>
              ✅ Comprehensive admin dashboard for oversight
            </li>
          </ul>
        </div>

        <div className="about-footer">
          <p className="about-footer-text">
            © 2026 Clinic Management System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
