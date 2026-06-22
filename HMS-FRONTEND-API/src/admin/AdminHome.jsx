import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import './admin.css';

export default function AdminHome() {
  const [doctorCount, setDoctorCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  const [prescriptionCount, setPrescriptionCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const doctorRes = await axios.get(`${config.url}/admin/countdoctors`);
        const patientRes = await axios.get(`${config.url}/admin/countpatients`);
        const prescriptionRes = await axios.get(`${config.url}/admin/countprescriptions`);

        setDoctorCount(doctorRes.data);
        setPatientCount(patientRes.data);
        setPrescriptionCount(prescriptionRes.data);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Welcome to Admin Dashboard</h1>
      </div>
      
      <div className="dashboard-cards">
        <div className="stat-card">
          <div className="icon-container">
            👨‍⚕️
          </div>
          <div className="stat-info">
            <h3>Total Doctors</h3>
            <p className="stat-value">{doctorCount}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="icon-container">
            🏥
          </div>
          <div className="stat-info">
            <h3>Total Patients</h3>
            <p className="stat-value">{patientCount}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="icon-container">
            📋
          </div>
          <div className="stat-info">
            <h3>Total Prescriptions</h3>
            <p className="stat-value">{prescriptionCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}