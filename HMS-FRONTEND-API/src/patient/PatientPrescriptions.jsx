import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { useAuth } from '../contextapi/AuthContext';
import './patient.css';

export default function PatientPrescriptions() {
  const { patientData } = useAuth();
  const [_patient, setPatient] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get patient data
    let patientInfo = patientData;
    if (!patientInfo) {
      const storedPatient = localStorage.getItem('patient');
      if (storedPatient) {
        patientInfo = JSON.parse(storedPatient);
      }
    }
    setPatient(patientInfo);

    if (patientInfo) {
      fetchPrescriptions(patientInfo.id);
    }
  }, [patientData]);

  const fetchPrescriptions = async (patientId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.url}/patient/myprescriptions?pid=${patientId}`);
      setPrescriptions(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      setError("Unable to fetch prescriptions at this time.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = (pdfPath) => {
    // Implementation for downloading prescription PDF
    if (pdfPath) {
      window.open(`${config.url}/downloads/${pdfPath}`, '_blank');
    }
  };

  return (
    <div className="patient-container">
      <div className="patient-header">
        <h1>My Prescriptions</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-spinner"></div>
      ) : prescriptions.length > 0 ? (
        <div className="patient-table">
          <table>
            <thead>
              <tr>
                <th>Prescription ID</th>
                <th>Doctor Name</th>
                <th>Diagnosis</th>
                <th>Date</th>
                <th>Medicine</th>
                <th>Dosage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((prescription) => (
                <tr key={prescription.id}>
                  <td>{prescription.id}</td>
                  <td>{prescription.doctorName}</td>
                  <td>{prescription.diagnosis}</td>
                  <td>{new Date(prescription.prescriptionDate).toLocaleDateString()}</td>
                  <td>{prescription.medicine}</td>
                  <td>{prescription.dosage}</td>
                  <td>
                    <div className="btn-group">
                      <button 
                        className="btn-view btn-small"
                        onClick={() => handleDownloadPDF(prescription.pdfPath)}
                        disabled={!prescription.pdfPath}
                      >
                        📄 Download PDF
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">💊</div>
          <h3>No Prescriptions Yet</h3>
          <p>You don't have any prescriptions at the moment. Prescriptions from your doctor will appear here.</p>
        </div>
      )}

      {/* Info Card */}
      <div className="info-card" style={{ marginTop: '40px', maxWidth: '800px', margin: '40px auto 0' }}>
        <div className="card-header">
          <h3>About Prescriptions</h3>
        </div>
        <div className="card-body">
          <p style={{ color: 'var(--text-medium)', lineHeight: '1.8' }}>
            All prescriptions issued by your doctors will be stored here. You can view and download your prescription PDFs at any time. 
            Make sure to follow the prescribed dosage and duration as mentioned by your doctor. If you have any questions about your 
            prescriptions, please contact your doctor directly.
          </p>
        </div>
      </div>
    </div>
  );
}
