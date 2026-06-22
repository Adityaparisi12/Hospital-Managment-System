import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import './doctor.css';

export default function DoctorProfile() {
  const [doctor, setDoctor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    licenseid: '',
    email: '',
    contact: '',
    username: '',
    password: '',
    approved: false,
    available: null
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get doctor data from localStorage
    const doctorData = localStorage.getItem('doctor');
    if (doctorData) {
      const parsedDoctor = JSON.parse(doctorData);
      setDoctor(parsedDoctor);
      setFormData({
        id: parsedDoctor.id || '',
        name: parsedDoctor.name || '',
        licenseid: parsedDoctor.licenseid || '',
        email: parsedDoctor.email || '',
        contact: parsedDoctor.contact || '',
        username: parsedDoctor.username || '',
        password: '', // Don't pre-fill password for security
        approved: parsedDoctor.approved || false,
        available: parsedDoctor.available ?? null
      });
      setLoading(false);
    } else {
      setError('No doctor data found. Please login again.');
      setLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage('');
    setError('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original doctor data
    if (doctor) {
      setFormData({
        id: doctor.id || '',
        name: doctor.name || '',
        licenseid: doctor.licenseid || '',
        email: doctor.email || '',
        contact: doctor.contact || '',
        username: doctor.username || '',
        password: '',
        approved: doctor.approved || false,
        available: doctor.available ?? null
      });
    }
    setMessage('');
    setError('');
  };

  const handleToggleAvailability = async () => {
    if (!doctor?.id) {
      setError('No doctor data found. Please login again.');
      return;
    }

    const currentAvailable = doctor.available ?? true;
    const nextAvailable = !currentAvailable;

    setAvailabilityLoading(true);
    setMessage('');
    setError('');
    try {
      const response = await axios.put(
        `${config.url}/doctor/updateavailability?did=${doctor.id}&available=${nextAvailable}`
      );

      const updatedDoctor = {
        ...doctor,
        available: nextAvailable,
      };

      localStorage.setItem('doctor', JSON.stringify(updatedDoctor));
      setDoctor(updatedDoctor);
      setFormData({ ...formData, available: nextAvailable });
      setMessage(response.data || (nextAvailable ? 'Doctor marked as Available' : 'Doctor marked as Not Available'));
    } catch (err) {
      if (err.response) {
        setError(err.response.data || 'Failed to update availability');
      } else if (err.request) {
        setError('Cannot connect to server. Please check if the backend is running.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.contact) {
      setError('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Contact validation (10 digits)
    const contactRegex = /^\d{10}$/;
    if (!contactRegex.test(formData.contact)) {
      setError('Contact number must be exactly 10 digits');
      return;
    }

    try {
      // Prepare complete Doctor object as expected by service layer
      const doctorUpdateData = {
        id: formData.id,
        name: formData.name,
        licenseid: formData.licenseid,
        email: formData.email,
        contact: formData.contact,
        username: formData.username,
        password: formData.password && formData.password.trim() !== '' 
          ? formData.password 
          : doctor.password, // Keep existing password if not changed
        approved: formData.approved,
        available: formData.available
      };

      const response = await axios.post(
        `${config.url}/doctor/updateprofile`,
        doctorUpdateData
      );

      if (response.status === 200) {
        setMessage(response.data || 'Doctor Profile updated successfully');
        
        // Update localStorage with new data (without password)
        const updatedDoctor = {
          id: doctorUpdateData.id,
          name: doctorUpdateData.name,
          licenseid: doctorUpdateData.licenseid,
          email: doctorUpdateData.email,
          contact: doctorUpdateData.contact,
          username: doctorUpdateData.username,
          approved: doctorUpdateData.approved,
          available: doctorUpdateData.available
        };
        
        localStorage.setItem('doctor', JSON.stringify(updatedDoctor));
        setDoctor(updatedDoctor);
        
        setIsEditing(false);
        
        // Clear password field
        setFormData({ ...formData, password: '' });
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data || 'Failed to update Doctor Profile');
      } else if (err.request) {
        setError('Cannot connect to server. Please check if the backend is running.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="doctor-container">
        <div className="loading">Loading Profile...</div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="doctor-container">
        <div className="alert alert-error">{error || 'No doctor data found'}</div>
      </div>
    );
  }

  return (
    <div className="doctor-container">
      {/* Profile Header */}
      <div className="doctor-header">
        <h1>👤 My Profile</h1>
        <p className="header-subtitle">View and manage your profile information</p>
      </div>

      {/* Messages */}
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Profile Card */}
      <div className="profile-section">
        {/* Profile Header with Avatar */}
        <div className="profile-header">
          <div className="profile-avatar">
            {doctor.name ? doctor.name.charAt(0).toUpperCase() : 'D'}
          </div>
          <div className="profile-info">
            <h2>{doctor.name}</h2>
            <p className="subtitle">License ID: {doctor.licenseid}</p>
            <span className={`status-badge ${doctor.approved ? 'approved' : 'pending'}`}>
              {doctor.approved ? '✓ Approved' : '⏳ Pending Approval'}
            </span>
            <div style={{ marginTop: '12px' }}>
              <button
                type="button"
                className={doctor.available === false ? 'btn-secondary' : 'btn-primary'}
                onClick={handleToggleAvailability}
                disabled={availabilityLoading}
                style={{ padding: '10px 18px' }}
              >
                {availabilityLoading
                  ? 'Updating...'
                  : doctor.available === false
                    ? 'Set Available'
                    : 'Set Not Available'}
              </button>
            </div>
          </div>
        </div>

        {/* View Mode */}
        {!isEditing ? (
          <div>
            <div className="profile-details">
              <div className="profile-field">
                <div className="field-label">Doctor ID</div>
                <div className="field-value">{doctor.id}</div>
              </div>

              <div className="profile-field">
                <div className="field-label">Full Name</div>
                <div className="field-value">{doctor.name}</div>
              </div>

              <div className="profile-field">
                <div className="field-label">License ID</div>
                <div className="field-value">{doctor.licenseid}</div>
              </div>

              <div className="profile-field">
                <div className="field-label">Email Address</div>
                <div className="field-value">{doctor.email}</div>
              </div>

              <div className="profile-field">
                <div className="field-label">Contact Number</div>
                <div className="field-value">{doctor.contact}</div>
              </div>

              <div className="profile-field">
                <div className="field-label">Username</div>
                <div className="field-value">{doctor.username}</div>
              </div>

              <div className="profile-field">
                <div className="field-label">Account Status</div>
                <div className="field-value">
                  <span className={`status-indicator ${doctor.approved ? 'status-approved' : 'status-pending'}`}>
                    <span className={`status-dot ${doctor.approved ? 'active' : 'pending'}`}></span>
                    {doctor.approved ? 'Approved' : 'Pending Approval'}
                  </span>
                </div>
              </div>

              <div className="profile-field">
                <div className="field-label">Availability</div>
                <div className="field-value">
                  <span className={`status-indicator ${doctor.available === false ? 'status-pending' : 'status-approved'}`}>
                    <span className={`status-dot ${doctor.available === false ? 'pending' : 'active'}`}></span>
                    {doctor.available === false ? 'Not Available' : 'Available'}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center mt-3">
              <button onClick={handleEdit} className="btn-primary">
                ✏️ Edit Profile
              </button>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength="100"
              />
            </div>

            <div className="form-group">
              <label htmlFor="licenseid">License ID *</label>
              <input
                type="text"
                id="licenseid"
                name="licenseid"
                value={formData.licenseid}
                onChange={handleChange}
                required
                maxLength="10"
                readOnly
                style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                title="License ID cannot be changed"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                maxLength="100"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact">Contact Number *</label>
              <input
                type="text"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
                maxLength="10"
                pattern="\d{10}"
                placeholder="10-digit number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="username">Username *</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                maxLength="50"
                readOnly
                style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                title="Username cannot be changed"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">New Password (Leave blank to keep current)</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                maxLength="50"
                placeholder="Enter new password or leave blank"
              />
            </div>

            <div className="btn-group" style={{ justifyContent: 'center', marginTop: '30px' }}>
              <button type="submit" className="btn-primary">
                💾 Save Changes
              </button>
              <button type="button" onClick={handleCancel} className="btn-secondary">
                ✕ Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Account Information Card */}
      <div className="profile-summary-card" style={{ marginTop: '30px' }}>
        <h2>Account Information</h2>
        <div style={{ marginTop: '20px' }}>
          <div className="profile-detail-item">
            <span className="detail-label">Account Type</span>
            <span className="detail-value">Doctor</span>
          </div>
          <div className="profile-detail-item">
            <span className="detail-label">Registration Status</span>
            <span className={`detail-value status-badge ${doctor.approved ? 'approved' : 'pending'}`}>
              {doctor.approved ? 'Approved by Admin ✓' : 'Waiting for Admin Approval ⏳'}
            </span>
          </div>
          {!doctor.approved && (
            <div className="alert alert-info" style={{ marginTop: '20px' }}>
              <strong>ℹ️ Note:</strong> Your account is pending admin approval. You will have full access once approved.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
