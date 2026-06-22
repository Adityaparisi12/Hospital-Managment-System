import { useState } from 'react';
import './doctor.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../config';

export default function DoctorRegister() {
  const [formData, setFormData] = useState({
    name: '',
    licenseid: '',
    email: '',
    contact: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validation
    if (!formData.name || !formData.licenseid || !formData.email || 
        !formData.contact || !formData.username || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Contact validation (10 digits)
    const contactRegex = /^\d{10}$/;
    if (!contactRegex.test(formData.contact)) {
      setError("Contact number must be exactly 10 digits");
      return;
    }

    // License ID validation (max 10 characters)
    if (formData.licenseid.length > 10) {
      setError("License ID cannot exceed 10 characters");
      return;
    }

    // Password validation
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Username validation (max 50 characters)
    if (formData.username.length > 50) {
      setError("Username cannot exceed 50 characters");
      return;
    }

    setLoading(true);
    
    try {
      const registrationData = {
        name: formData.name,
        licenseid: formData.licenseid,
        email: formData.email,
        contact: formData.contact,
        username: formData.username,
        password: formData.password,
        approved: false // Set by default during registration
      };

      const response = await axios.post(
        `${config.url}/doctor/register`, 
        registrationData
      );
      
      if (response.status === 200) {
        setMessage("Registration successful! Please wait for admin approval to login.");
        setFormData({
          name: '',
          licenseid: '',
          email: '',
          contact: '',
          username: '',
          password: '',
          confirmPassword: ''
        });
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/doctorlogin');
        }, 3000);
      }
    } catch (error) {
      setLoading(false);
      if (error.response) {
        if (error.response.status === 409) {
          setError("Username, email, or contact already exists. Please use different credentials.");
        } else if (error.response.status === 400) {
          setError(error.response.data || "Invalid registration data. Please check your inputs.");
        } else {
          setError(error.response.data || "Registration failed. Please try again.");
        }
      } else if (error.request) {
        setError("Cannot connect to server. Please check if the backend is running.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="doctor-container">
      <div className="doctor-form" style={{ maxWidth: '600px' }}>
        <div className="text-center mb-3">
          <h2 className="doctor-login-title">👨‍⚕️ Doctor Registration</h2>
          <p className="doctor-login-subtitle">Join our Hospital Management System</p>
        </div>
        
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input 
                type="text" 
                id="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                maxLength="100"
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="licenseid">Medical License ID *</label>
              <input 
                type="text" 
                id="licenseid" 
                value={formData.licenseid} 
                onChange={handleChange} 
                required 
                maxLength="10"
                placeholder="Enter your medical license ID"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input 
                type="email" 
                id="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                maxLength="100"
                placeholder="doctor@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact">Contact Number *</label>
              <input 
                type="text" 
                id="contact" 
                value={formData.contact} 
                onChange={handleChange} 
                required 
                maxLength="10"
                pattern="\d{10}"
                placeholder="10-digit mobile number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="username">Username *</label>
              <input 
                type="text" 
                id="username" 
                value={formData.username} 
                onChange={handleChange} 
                required 
                maxLength="50"
                placeholder="Choose a username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input 
                type={showPassword ? "text" : "password"}
                id="password" 
                value={formData.password} 
                onChange={handleChange} 
                required 
                maxLength="50"
                placeholder="Minimum 6 characters"
              />
              <label className="password-toggle">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword((prev) => !prev)}
                />
                <span>Show password</span>
              </label>
            </div>

            <div className="form-group full-width">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input 
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                required 
                maxLength="50"
                placeholder="Re-enter your password"
              />
              <label className="password-toggle">
                <input
                  type="checkbox"
                  checked={showConfirmPassword}
                  onChange={() => setShowConfirmPassword((prev) => !prev)}
                />
                <span>Show password</span>
              </label>
            </div>
          </div>

          <div className="alert alert-info" style={{ fontSize: '13px', marginBottom: '20px' }}>
            <strong>ℹ️ Note:</strong> Your account will require admin approval before you can login.
          </div>

          <button 
            type="submit" 
            className="btn-primary btn-full-width"
            disabled={loading}
          >
            {loading ? '⏳ Registering...' : '📝 Register as Doctor'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <span style={{ color: 'var(--text-medium)' }}>Already have an account? </span>
            <a 
              href="/doctorlogin" 
              style={{ color: 'var(--primary-red)', fontWeight: '600', textDecoration: 'none' }}
            >
              Login here
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
