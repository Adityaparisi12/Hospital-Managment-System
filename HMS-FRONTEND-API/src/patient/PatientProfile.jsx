import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { useAuth } from '../contextapi/AuthContext';
import './patient.css';

export default function PatientProfile() {
  const { patientData, setPatientData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    age: '',
    email: '',
    contact: '',
    username: '',
    password: ''
  });

  useEffect(() => {
    // Load patient data on component mount
    let patient = patientData;
    if (!patient) {
      const storedPatient = localStorage.getItem('patient');
      if (storedPatient) {
        try {
          patient = JSON.parse(storedPatient);
        } catch (e) {
          console.error('Error parsing stored patient data:', e);
        }
      }
    }
    
    if (patient) {
      setFormData({
        id: patient.id || '',
        name: patient.name || '',
        age: patient.age || '',
        email: patient.email || '',
        contact: patient.contact || '',
        username: patient.username || '',
        password: patient.password || ''
      });
    }
  }, [patientData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage("");
    setError("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMessage("");
    setError("");
    // Reset to original data
    let patient = patientData;
    if (!patient) {
      const storedPatient = localStorage.getItem('patient');
      if (storedPatient) {
        patient = JSON.parse(storedPatient);
      }
    }
    if (patient) {
      setFormData({
        id: patient.id || '',
        name: patient.name || '',
        age: patient.age || '',
        email: patient.email || '',
        contact: patient.contact || '',
        username: patient.username || '',
        password: patient.password || ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Validation
    if (!formData.contact || formData.contact.toString().length !== 10) {
      setError("Contact number must be exactly 10 digits!");
      return;
    }

    const ageNum = parseInt(formData.age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 150) {
      setError("Please enter a valid age!");
      return;
    }

    const updatedData = {
      id: parseInt(formData.id),
      name: formData.name,
      age: ageNum,
      email: formData.email,
      contact: formData.contact.toString(),
      username: formData.username,
      password: formData.password
    };

    try {
      const response = await axios.put(`${config.url}/patient/updatepatientprofile`, updatedData);
      
      if (response && response.status === 200 && response.data) {
        setMessage("Profile updated successfully!");
        setIsEditing(false);
        
        // Update context and localStorage with server response
        setPatientData(response.data);
        localStorage.setItem('patient', JSON.stringify(response.data));
        
        // Update form data with the response
        setFormData({
          id: response.data.id || '',
          name: response.data.name || '',
          age: response.data.age || '',
          email: response.data.email || '',
          contact: response.data.contact || '',
          username: response.data.username || '',
          password: response.data.password || ''
        });
      }
    } catch (error) {
      if (error && error.response) {
        if (error.response.status === 404) {
          setError("Patient ID not found!");
        } else {
          setError(error.response.data || "Failed to update profile");
        }
      } else if (error && error.request) {
        setError("Cannot connect to server. Please check if the backend is running.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="patient-container">
      <div className="patient-header">
        <h1>My Profile</h1>
      </div>

      <div className="profile-section">
        <div className="profile-header">
          <div className="profile-avatar">
            {formData.name ? formData.name.charAt(0).toUpperCase() : 'P'}
          </div>
          <div className="profile-info">
            <h2>{formData.name || 'Patient Name'}</h2>
            <p className="subtitle">Patient ID: {formData.id}</p>
          </div>
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="profile-details">
            <div className="profile-field">
              <label className="field-label">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="field-input"
                  required
                />
              ) : (
                <div className="field-value">{formData.name}</div>
              )}
            </div>

            <div className="profile-field">
              <label className="field-label">Age</label>
              {isEditing ? (
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="field-input"
                  min="1"
                  max="150"
                  required
                />
              ) : (
                <div className="field-value">{formData.age} years</div>
              )}
            </div>

            <div className="profile-field">
              <label className="field-label">Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="field-input"
                  required
                />
              ) : (
                <div className="field-value">{formData.email}</div>
              )}
            </div>

            <div className="profile-field">
              <label className="field-label">Contact Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="field-input"
                  pattern="[0-9]{10}"
                  maxLength="10"
                  required
                />
              ) : (
                <div className="field-value">{formData.contact}</div>
              )}
            </div>

            <div className="profile-field">
              <label className="field-label">Username</label>
              <div className="field-value">{formData.username}</div>
            </div>

            <div className="profile-field">
              <label className="field-label">Password</label>
              {isEditing ? (
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="field-input"
                  required
                />
              ) : (
                <div className="field-value">••••••••</div>
              )}
            </div>
          </div>

          {!isEditing && (
            <div className="btn-group" style={{ justifyContent: 'center', marginTop: '30px' }}>
              <button type="button" onClick={handleEdit} className="btn-primary">
                ✏️ Edit Profile
              </button>
            </div>
          )}

          {isEditing && (
            <div className="btn-group" style={{ justifyContent: 'center', marginTop: '30px' }}>
              <button type="submit" className="btn-primary">
                💾 Save Changes
              </button>
              <button type="button" onClick={handleCancel} className="btn-secondary">
                ✖ Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
