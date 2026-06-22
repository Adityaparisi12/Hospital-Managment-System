import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import './doctor.css';

export default function DoctorHome() {
  const [doctor, setDoctor] = useState(null);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    pendingBookings: 0,
    completedAppointments: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get doctor data from localStorage
    const doctorData = localStorage.getItem('doctor');
    if (doctorData) {
      const parsedDoctor = JSON.parse(doctorData);
      setDoctor(parsedDoctor);
      fetchDoctorStats(parsedDoctor.id);
    }
  }, []);

  const fetchDoctorStats = async (doctorId) => {
    try {
      // Fetch statistics for the doctor
      // Note: You may need to create these endpoints in your backend
      const appointmentsRes = await axios.get(`${config.url}/doctor/appointments/${doctorId}`);
      const bookingsRes = await axios.get(`${config.url}/doctor/bookings/${doctorId}`);
      
      // Calculate stats from the responses
      const appointments = appointmentsRes.data || [];
      const bookings = bookingsRes.data || [];
      
      const today = new Date().toISOString().split('T')[0];
      
      setStats({
        totalAppointments: appointments.length,
        todayAppointments: appointments.filter(apt => apt.appointmentDate === today).length,
        pendingBookings: bookings.filter(book => book.status === 'pending').length,
        completedAppointments: appointments.filter(apt => apt.status === 'completed').length
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctor stats:', error);
      // Set default values even if API fails
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="doctor-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="doctor-container">
      {/* Welcome Header */}
      <div className="doctor-header">
        <h1>Welcome, Dr. {doctor?.name || 'Doctor'}</h1>
        <p className="header-subtitle">Here's your dashboard overview</p>
      </div>

      {/* Doctor Profile Card */}
      <div className="profile-summary-card">
        <h2>Your Profile Information</h2>
        <div className="profile-details">
          <div className="profile-detail-item">
            <span className="detail-label">Name:</span>
            <span className="detail-value">{doctor?.name}</span>
          </div>
          <div className="profile-detail-item">
            <span className="detail-label">License ID:</span>
            <span className="detail-value">{doctor?.licenseid}</span>
          </div>
          <div className="profile-detail-item">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{doctor?.email}</span>
          </div>
          <div className="profile-detail-item">
            <span className="detail-label">Contact:</span>
            <span className="detail-value">{doctor?.contact}</span>
          </div>
          <div className="profile-detail-item">
            <span className="detail-label">Username:</span>
            <span className="detail-value">{doctor?.username}</span>
          </div>
          <div className="profile-detail-item">
            <span className="detail-label">Status:</span>
            <span className={`detail-value status-badge ${doctor?.approved ? 'approved' : 'pending'}`}>
              {doctor?.approved ? 'Approved ✓' : 'Pending Approval'}
            </span>
          </div>
        </div>
      </div>

      {/* Statistics Dashboard Cards */}
      <div className="dashboard-cards">
        <div className="stat-card">
          <div className="icon-container">
            📅
          </div>
          <div className="stat-info">
            <h3>Total Appointments</h3>
            <p className="stat-value">{stats.totalAppointments}</p>
            <span className="stat-description">All time appointments</span>
          </div>
        </div>

        <div className="stat-card highlight">
          <div className="icon-container">
            🕐
          </div>
          <div className="stat-info">
            <h3>Today's Appointments</h3>
            <p className="stat-value">{stats.todayAppointments}</p>
            <span className="stat-description">Scheduled for today</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="icon-container">
            ⏳
          </div>
          <div className="stat-info">
            <h3>Pending Bookings</h3>
            <p className="stat-value">{stats.pendingBookings}</p>
            <span className="stat-description">Awaiting confirmation</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="icon-container">
            ✅
          </div>
          <div className="stat-info">
            <h3>Completed</h3>
            <p className="stat-value">{stats.completedAppointments}</p>
            <span className="stat-description">Successfully completed</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="quick-actions-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions">
          <button className="action-button" onClick={() => navigate('/viewappointment')}>
            <span className="action-icon">👁️</span>
            <span>View Appointments</span>
          </button>
          <button className="action-button" onClick={() => navigate('/addprescription')}>
            <span className="action-icon">💊</span>
            <span>Add Prescription</span>
          </button>
          <button className="action-button" onClick={() => navigate('/doctorprofile')}>
            <span className="action-icon">👤</span>
            <span>My Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
