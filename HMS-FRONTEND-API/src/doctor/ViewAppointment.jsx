import React, { useEffect, useState } from 'react'
import axios from 'axios'
import config from '../config'
import { useAuth } from '../contextapi/AuthContext'
import './doctor.css'

export default function ViewAppointment() {
  const { doctorData } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let doctorInfo = doctorData;
    if (!doctorInfo) {
      const storedDoctor = localStorage.getItem('doctor');
      if (storedDoctor) {
        doctorInfo = JSON.parse(storedDoctor);
      }
    }
    setDoctor(doctorInfo);
    if (doctorInfo?.id) {
      fetchAppointments(doctorInfo.id);
    }
  }, [doctorData]);

  const fetchAppointments = async (doctorId) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${config.url}/doctor/viewappointments?did=${doctorId}`);
      setAppointments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Unable to fetch appointments at this time.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId, action) => {
    if (!doctor?.id) {
      setError('Doctor not logged in.');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');
    try {
      const url =
        action === 'accept'
          ? `${config.url}/doctor/acceptappointment?bid=${bookingId}&did=${doctor.id}`
          : `${config.url}/doctor/rejectappointment?bid=${bookingId}&did=${doctor.id}`;

      const response = await axios.put(url);
      setMessage(response.data || 'Updated');
      await fetchAppointments(doctor.id);
    } catch (error) {
      console.error('Error updating appointment:', error);
      setError(error?.response?.data || 'Unable to update appointment.');
    } finally {
      setLoading(false);
    }
  };

  const pendingAppointments = appointments.filter((a) => (a?.status || '').toUpperCase() === 'PENDING');
  const otherAppointments = appointments.filter((a) => (a?.status || '').toUpperCase() !== 'PENDING');

  return (
    <div className="doctor-container">
      <div className="doctor-header">
        <h1>Appointments</h1>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <>
          <div className="doctor-header" style={{ marginBottom: '20px' }}>
            <h2>Pending Requests</h2>
          </div>

          {pendingAppointments.length > 0 ? (
            <div className="doctor-table">
              <table>
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingAppointments.map((b) => (
                    <tr key={b.id}>
                      <td>{b.id}</td>
                      <td>{b.patient?.name || 'N/A'}</td>
                      <td>{b.appointment?.appointmentDate || 'N/A'}</td>
                      <td>{`${b.appointment?.startTime || ''} - ${b.appointment?.endTime || ''}`}</td>
                      <td>
                        <span className={`status-indicator status-${b.status?.toLowerCase()}`}>{b.status}</span>
                      </td>
                      <td>
                        <div className="btn-group">
                          <button
                            className="btn-primary btn-small"
                            onClick={() => updateStatus(b.id, 'accept')}
                            disabled={loading}
                          >
                            Accept
                          </button>
                          <button
                            className="btn-secondary btn-small"
                            onClick={() => updateStatus(b.id, 'reject')}
                            disabled={loading}
                          >
                            Reject
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
              <div className="empty-icon">📅</div>
              <h3>No Pending Requests</h3>
              <p>New appointment requests from patients will show up here.</p>
            </div>
          )}

          <div className="doctor-header" style={{ marginTop: '50px', marginBottom: '20px' }}>
            <h2>All Requests</h2>
          </div>

          {otherAppointments.length > 0 ? (
            <div className="doctor-table">
              <table>
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {otherAppointments.map((b) => (
                    <tr key={b.id}>
                      <td>{b.id}</td>
                      <td>{b.patient?.name || 'N/A'}</td>
                      <td>{b.appointment?.appointmentDate || 'N/A'}</td>
                      <td>{`${b.appointment?.startTime || ''} - ${b.appointment?.endTime || ''}`}</td>
                      <td>
                        <span className={`status-indicator status-${b.status?.toLowerCase()}`}>{b.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🗂️</div>
              <p>No appointment requests yet.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
