import { useState } from 'react';
import './doctor.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import { useAuth } from '../contextapi/AuthContext'; 

export default function DoctorLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { setIsDoctorLoggedIn } = useAuth();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    
    try {
      const response = await axios.post(`${config.url}/doctor/checkdoctorlogin`, formData);
      if (response.status === 200) {
        // Store doctor data in localStorage
        localStorage.setItem('doctor', JSON.stringify(response.data));
        setIsDoctorLoggedIn(true);
        navigate("/doctorhome");
      } else {
        setMessage(response.data);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setError("Invalid username or password. Please try again.");
        } else if (error.response.status === 403) {
          setError("Your account is pending admin approval.");
        } else if (error.response.status === 404) {
          setError("Doctor not found. Please check your credentials.");
        } else {
          setError(error.response.data || "Login failed. Please try again.");
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
      <div className="doctor-form">
        <div className="text-center mb-3">
          <h2 className="doctor-login-title">👨‍⚕️ Doctor Login</h2>
          <p className="doctor-login-subtitle">Hospital Management System</p>
        </div>
        
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" id="username" value={formData.username} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={formData.password}
              onChange={handleChange}
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
          <button type="submit" className="btn-primary btn-full-width">Login</button>
          
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <span style={{ color: 'var(--text-medium)' }}>Don't have an account? </span>
            <a 
              href="/doctorregister" 
              style={{ color: 'var(--primary-red)', fontWeight: '600', textDecoration: 'none' }}
            >
              Register here
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
