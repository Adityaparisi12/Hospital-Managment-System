import React, { useEffect, useState } from 'react'
import axios from 'axios'
import config from '../config'
import './doctor.css'

export default function DoctorAddPrescription() {
  const [doctor, setDoctor] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    pid: '',
    patientGender: '',
    doctorSpecialization: '',
    diagnosis: '',
    medicine: '',
    dosage: '',
    duration: '',
    instructions: '',
  });

  useEffect(() => {
    const storedDoctor = localStorage.getItem('doctor');
    if (storedDoctor) {
      setDoctor(JSON.parse(storedDoctor));
    }
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${config.url}/admin/viewallpatients`);
      setPatients(Array.isArray(response.data) ? response.data : []);
    } catch (e) {
      console.error('Error fetching patients:', e);
    }
  };

  const selectedPatient = patients.find((p) => String(p.id) === String(formData.pid));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!doctor?.id) {
      setError('Doctor not logged in.');
      return;
    }
    if (!formData.pid) {
      setError('Please select a patient.');
      return;
    }
    if (!formData.diagnosis || !formData.medicine || !formData.dosage || !formData.duration || !formData.instructions) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        pid: Number(formData.pid),
        did: Number(doctor.id),
        patientGender: formData.patientGender,
        doctorSpecialization: formData.doctorSpecialization,
        diagnosis: formData.diagnosis,
        medicine: formData.medicine,
        dosage: formData.dosage,
        duration: formData.duration,
        instructions: formData.instructions,
      };

      const response = await axios.post(`${config.url}/doctor/addprescription`, payload);
      setMessage('Prescription Added Successfully');

      // If PDF is available immediately, open it
      if (response?.data?.pdfPath) {
        window.open(`${config.url}/downloads/${response.data.pdfPath}`, '_blank');
      }

      setFormData({
        pid: '',
        patientGender: '',
        doctorSpecialization: '',
        diagnosis: '',
        medicine: '',
        dosage: '',
        duration: '',
        instructions: '',
      });
    } catch (err) {
      console.error('Error adding prescription:', err);
      setError(err?.response?.data || 'Unable to add prescription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doctor-container">
      <div className="doctor-header">
        <h1>💊 Add Prescription</h1>
        <p className="header-subtitle">Create and generate a PDF prescription for a patient</p>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <form className="doctor-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Patient *</label>
            <select name="pid" value={formData.pid} onChange={handleChange} required>
              <option value="">-- Select Patient --</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (ID: {p.id})
                </option>
              ))}
            </select>
            {selectedPatient && (
              <div style={{ marginTop: '8px', color: 'var(--text-medium)', fontSize: '14px' }}>
                Age: {selectedPatient.age} | Email: {selectedPatient.email}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Patient Gender (optional)</label>
            <select name="patientGender" value={formData.patientGender} onChange={handleChange}>
              <option value="">-- Select --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Doctor Specialization (optional)</label>
            <input
              type="text"
              name="doctorSpecialization"
              value={formData.doctorSpecialization}
              onChange={handleChange}
              placeholder="e.g., Cardiologist"
            />
          </div>

          <div className="form-group">
            <label>Diagnosis *</label>
            <textarea
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              required
              rows="2"
              placeholder="Write diagnosis"
            ></textarea>
          </div>

          <div className="form-group">
            <label>Medicine *</label>
            <textarea
              name="medicine"
              value={formData.medicine}
              onChange={handleChange}
              required
              rows="2"
              placeholder="Medicine name(s)"
            ></textarea>
          </div>

          <div className="form-group">
            <label>Dosage *</label>
            <textarea
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
              required
              rows="2"
              placeholder="Dosage details"
            ></textarea>
          </div>

          <div className="form-group">
            <label>Duration *</label>
            <textarea
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              rows="2"
              placeholder="Duration (e.g., 5 days)"
            ></textarea>
          </div>

          <div className="form-group full-width">
            <label>Instructions *</label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              required
              rows="3"
              placeholder="Additional instructions"
            ></textarea>
          </div>
        </div>

        <div className="btn-group" style={{ justifyContent: 'center', marginTop: '30px' }}>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Generate Prescription'}
          </button>
        </div>
      </form>
    </div>
  )
}
