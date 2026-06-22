import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import { useAuth } from "../contextapi/AuthContext";
import './patient.css';

export default function PatientHome() {
  const { patientData } = useAuth();
  const [patient, setPatient] = useState(null);
  const [stats, setStats] = useState({
    appointments: 0,
    prescriptions: 0,
    doctors: 0
  });

  useEffect(() => {
    // Get patient data from context or localStorage
    if (patientData) {
      setPatient(patientData);
    } else {
      const storedPatient = localStorage.getItem('patient');
      if (storedPatient) {
        setPatient(JSON.parse(storedPatient));
      }
    }
  }, [patientData]);

  useEffect(() => {
    const fetchStats = async (patientId) => {
      try {
        const [appointmentsRes, prescriptionsRes] = await Promise.all([
          axios.get(`${config.url}/patient/myappointments?pid=${patientId}`),
          axios.get(`${config.url}/patient/myprescriptions?pid=${patientId}`)
        ]);

        const appointments = Array.isArray(appointmentsRes.data) ? appointmentsRes.data : [];
        const prescriptions = Array.isArray(prescriptionsRes.data) ? prescriptionsRes.data : [];
        const consultedDoctorIds = appointments
          .map((appt) => appt.appointment?.doctor?.id)
          .filter((id) => id !== undefined && id !== null);

        setStats({
          appointments: appointments.length,
          prescriptions: prescriptions.length,
          doctors: new Set(consultedDoctorIds).size
        });
      } catch (error) {
        console.error('Failed to fetch patient dashboard stats:', error);
      }
    };

    if (patient?.id) {
      fetchStats(patient.id);
    }
  }, [patient]);

  return (
    <div className="patient-container">
      <div className="patient-header">
        <h1>Welcome, {patient?.name || 'Patient'}! 👋</h1>
      </div>
      
      <div className="dashboard-cards">
        <div className="stat-card">
          <div className="icon-container">
            📋
          </div>
          <div className="stat-info">
            <h3>My Appointments</h3>
            <p className="stat-value">{stats.appointments}</p>
            <p className="stat-label">Total Appointments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="icon-container">
            💊
          </div>
          <div className="stat-info">
            <h3>Prescriptions</h3>
            <p className="stat-value">{stats.prescriptions}</p>
            <p className="stat-label">Active Prescriptions</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="icon-container">
            👨‍⚕️
          </div>
          <div className="stat-info">
            <h3>Doctors</h3>
            <p className="stat-value">{stats.doctors}</p>
            <p className="stat-label">Consulted Doctors</p>
          </div>
        </div>
      </div>

      <div className="patient-info-section">
        <div className="info-card">
          <div className="card-header">
            <h3>Quick Information</h3>
          </div>
          <div className="card-body">
            <div className="info-row">
              <span className="info-label">Patient ID:</span>
              <span className="info-value">{patient?.id || 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Name:</span>
              <span className="info-value">{patient?.name || 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Age:</span>
              <span className="info-value">{patient?.age || 'N/A'} years</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{patient?.email || 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Contact:</span>
              <span className="info-value">{patient?.contact || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="info-card">
          <div className="card-header">
            <h3>Recent Activity</h3>
          </div>
          <div className="card-body">
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>No recent activity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
