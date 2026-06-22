import { useState } from 'react';
import './patient.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import config from '../config';

export default function PatientRegister() 
{
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    contact: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => 
  {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => 
  {
    e.preventDefault();
    setError("");
    setMessage("");
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.contact.length !== 10) {
      setError("Contact number must be exactly 10 digits!");
      return;
    }

    if (formData.age < 1 || formData.age > 150) {
      setError("Please enter a valid age!");
      return;
    }

    // Prepare data for backend (without confirmPassword)
    const patientData = {
      name: formData.name,
      age: parseInt(formData.age),
      email: formData.email,
      contact: formData.contact,
      username: formData.username,
      password: formData.password
    };
    
    try 
    {
      const response = await axios.post(`${config.url}/patient/patientregister`, patientData);
      if (response.status === 200) 
      {
        setMessage("Registration successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/patientlogin");
        }, 2000);
      }
      else 
      {
        setError(response.data);
      }
    } 
    catch (error) 
    {
      if (error.response) 
      {
        setError(error.response.data || "Registration failed. Please try again.");
      } 
      else if (error.request) 
      {
        setError("Cannot connect to server. Please check if the backend is running.");
      }
      else 
      {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="patient-container">
      <div className="patient-form" style={{ maxWidth: '650px' }}>
        <div className="text-center mb-3">
          <h2 className="patient-login-title">📋 Patient Registration</h2>
          <p className="patient-login-subtitle">Create your account</p>
        </div>
        
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                id="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Enter your full name"
                required 
              />
            </div>

            <div className="form-group">
              <label>Age</label>
              <input 
                type="number" 
                id="age" 
                value={formData.age} 
                onChange={handleChange} 
                placeholder="Enter your age"
                min="1"
                max="150"
                required 
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                id="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="Enter your email"
                required 
              />
            </div>

            <div className="form-group">
              <label>Contact Number</label>
              <input 
                type="tel" 
                id="contact" 
                value={formData.contact} 
                onChange={handleChange} 
                placeholder="Enter 10-digit contact number"
                pattern="[0-9]{10}"
                maxLength="10"
                required 
              />
            </div>

            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                id="username" 
                value={formData.username} 
                onChange={handleChange} 
                placeholder="Choose a username"
                required 
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input 
                type={showPassword ? "text" : "password"}
                id="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="Choose a strong password"
                required 
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
              <label>Confirm Password</label>
              <input 
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                placeholder="Re-enter your password"
                required 
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

          <button type="submit" className="btn-primary btn-full-width">Register</button>
        </form>
        
        <div className="text-center mt-3">
          <p>Already have an account? <Link to="/patientlogin" className="text-link">Login Here</Link></p>
        </div>
      </div>
    </div>
  );
}
