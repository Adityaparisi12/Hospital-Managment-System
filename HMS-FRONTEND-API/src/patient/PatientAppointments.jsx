import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { useAuth } from '../contextapi/AuthContext';
import './patient.css';

export default function PatientAppointments() {
  const { patientData } = useAuth();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

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
      fetchAppointments(patientInfo.id);
    }
    fetchDoctors();
  }, [patientData]);

  const fetchAppointments = async (patientId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.url}/patient/myappointments?pid=${patientId}`);
      setAppointments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Unable to fetch appointments at this time.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${config.url}/admin/viewalldoctors`);
      // Filter only approved doctors
      const approvedDoctors = response.data.filter(doc => doc.approved);
      // Hide doctors that are explicitly marked as not available (available=false). Null/undefined => treat as available.
      const availableDoctors = approvedDoctors.filter(doc => doc.available !== false);
      setDoctors(availableDoctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const handleBookAppointment = () => {
    setShowBookingModal(true);
    setMessage("");
    setError("");
  };

  const openBookingForDoctor = (doctorId) => {
    setSelectedDoctorId(String(doctorId));
    setAppointmentDate("");
    setStartTime("");
    setEndTime("");
    handleBookAppointment();
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const patientId = patient?.id;
    if (!patientId) {
      setError("Patient not logged in.");
      return;
    }

    if (!selectedDoctorId || !appointmentDate || !startTime || !endTime) {
      setError("Please select doctor, date and time.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        pid: patientId,
        did: Number(selectedDoctorId),
        appointmentDate,
        startTime,
        endTime,
      };

      const response = await axios.post(`${config.url}/patient/bookappointment`, payload);
      setMessage(response.data || "Appointment Booked Successfully");
      setShowBookingModal(false);
      await fetchAppointments(patientId);
    } catch (error) {
      console.error("Error booking appointment:", error);
      setError(error?.response?.data || "Unable to book appointment.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (bookingId) => {
    const patientId = patient?.id;
    if (!patientId) {
      setError('Patient not logged in.');
      return;
    }

    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');
    try {
      const response = await axios.put(
        `${config.url}/patient/cancelappointment?bid=${bookingId}&pid=${patientId}`
      );
      setMessage(response.data || 'Appointment Cancelled');
      await fetchAppointments(patientId);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      setError(error?.response?.data || 'Unable to cancel appointment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-container">
      <div className="patient-header">
        <h1>My Appointments</h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button className="btn-primary" onClick={handleBookAppointment}>
          📅 Book New Appointment
        </button>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-spinner"></div>
      ) : appointments.length > 0 ? (
        <div className="patient-table">
          <table>
            <thead>
              <tr>
                <th>Appointment ID</th>
                <th>Doctor Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.id}</td>
                  <td>{appointment.appointment?.doctor?.name || 'N/A'}</td>
                  <td>{appointment.appointment?.appointmentDate || 'N/A'}</td>
                  <td>{`${appointment.appointment?.startTime || ''} - ${appointment.appointment?.endTime || ''}`}</td>
                  <td>
                    <span className={`status-indicator status-${appointment.status?.toLowerCase()}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group">
                      <button className="btn-view btn-small">View</button>
                      {['pending', 'accepted'].includes((appointment.status || '').toLowerCase()) && (
                        <button
                          className="btn-secondary btn-small"
                          onClick={() => handleCancelAppointment(appointment.id)}
                          disabled={loading}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3>No Appointments Yet</h3>
          <p>You haven't booked any appointments. Start by booking your first appointment with a doctor.</p>
        </div>
      )}

      {/* Available Doctors Section */}
      <div className="patient-header" style={{ marginTop: '50px' }}>
        <h2>Available Doctors</h2>
      </div>

      {doctors.length > 0 ? (
        <div className="data-grid">
          {doctors.map((doctor) => (
            <div className="data-card" key={doctor.id}>
              <div className="card-header">
                <h3 className="card-title">👨‍⚕️ {doctor.name}</h3>
                <span className={`badge ${doctor.available === false ? 'badge-white' : 'badge-red'}`}>
                  {doctor.available === false ? 'Not Available' : 'Available'}
                </span>
              </div>
              <div className="card-body">
                <div className="card-row">
                  <span className="label">License ID:</span>
                  <span className="value">{doctor.licenseid}</span>
                </div>
                <div className="card-row">
                  <span className="label">Email:</span>
                  <span className="value">{doctor.email}</span>
                </div>
                <div className="card-row">
                  <span className="label">Contact:</span>
                  <span className="value">{doctor.contact}</span>
                </div>
              </div>
              <div className="card-footer">
                <button className="btn-primary btn-small" onClick={() => openBookingForDoctor(doctor.id)}>
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">👨‍⚕️</div>
          <p>No doctors available at the moment.</p>
        </div>
      )}

      {showBookingModal && (
        <div className="modal-overlay" onClick={closeBookingModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book Appointment</h2>
            </div>

            <form onSubmit={handleSubmitBooking}>
              <div className="form-group">
                <label>Select Doctor</label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                >
                  <option value="">-- Select --</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Appointment Date</label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeBookingModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Booking...' : 'Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
