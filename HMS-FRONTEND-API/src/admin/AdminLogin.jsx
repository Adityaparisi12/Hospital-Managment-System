import { useState } from 'react';
import './admin.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import { useAuth } from '../contextapi/AuthContext'; 

export default function AdminLogin() 
{
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const { setIsAdminLoggedIn} = useAuth();

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
    
    try 
    {
      const response = await axios.post(`${config.url}/admin/checkadminlogin`, formData);
      if (response.status === 200) 
      {
        setIsAdminLoggedIn(true);
        navigate("/adminhome");
      }
      else 
      {
        setMessage(response.data);
      }
    } 
    catch (error) 
    {
      if (error.response) 
      {
        if (error.response.status === 401) 
        {
          setError("Invalid username or password. Please try again.");
        }
        else if (error.response.status === 404) 
        {
          setError("Admin not found. Please check your credentials.");
        }
        else 
        {
          setError(error.response.data || "Login failed. Please try again.");
        }
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
    <div className="admin-container">
      <div className="admin-form">
        <div className="text-center mb-3">
          <h2 className="admin-login-title">🏥 Admin Login</h2>
          <p className="admin-login-subtitle">Clinic Management System</p>
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
        </form>
      </div>
    </div>
  );
}