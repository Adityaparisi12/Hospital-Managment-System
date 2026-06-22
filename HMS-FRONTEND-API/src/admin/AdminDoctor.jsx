import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import './admin.css';

export default function AdminDoctor() {

  // ---------- STATE ----------
  const [doctors, setDoctors] = useState([]);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [doctorData, setDoctorData] = useState({
    name: "",
    licenseid: "",
    email: "",
    contact: "",
    username: "",
    password: ""
  });

  // ---------- HANDLE INPUT ----------
  const handleChange = (e) => {
    setDoctorData({ ...doctorData, [e.target.name]: e.target.value });
  };

  // ---------- ADD DOCTOR ----------
  const addDoctor = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${config.url}/admin/adddoctor`, {
        ...doctorData,
        approved: true   // admin-added doctor → approved
      });

      setMessage(res.data);
      setError("");
      setDoctorData({
        name: "",
        licenseid: "",
        email: "",
        contact: "",
        username: "",
        password: ""
      });
      fetchDoctors();
    } catch (err) {
      setError(err.response?.data || "Failed to add doctor");
      setMessage("");
    }
  };

  // ---------- VIEW ALL DOCTORS ----------
  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${config.url}/admin/viewalldoctors`);
      setDoctors(res.data);
    } catch (err) {
      setError(err.response?.data || "Failed to fetch doctors");
    }
  };

  // ---------- FETCH PENDING DOCTORS ----------
  const fetchPendingDoctors = async () => {
    try {
      const res = await axios.get(`${config.url}/admin/pendingdoctors`);
      setPendingDoctors(res.data);
    } catch (err) {
      setError(err.response?.data || "Failed to fetch pending doctors");
    }
  };

  // ---------- APPROVE DOCTOR ----------
  const approveDoctor = async (id) => {
    try {
      const res = await axios.post(`${config.url}/admin/approvedoctor?did=${id}`);
      setMessage(res.data);
      setError("");
      fetchPendingDoctors();
      fetchDoctors();
    } catch (err) {
      setError(err.response?.data || "Failed to approve doctor");
      setMessage("");
    }
  };

  // ---------- REJECT DOCTOR ----------
  const rejectDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to reject this doctor registration?")) return;

    try {
      const res = await axios.delete(`${config.url}/admin/rejectdoctor?did=${id}`);
      setMessage(res.data);
      setError("");
      fetchPendingDoctors();
      fetchDoctors();
    } catch (err) {
      setError(err.response?.data || "Failed to reject doctor");
      setMessage("");
    }
  };

  // ---------- DELETE DOCTOR ----------
  const deleteDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;

    try {
      const res = await axios.delete(
        `${config.url}/admin/deletedoctor?did=${id}`
      );
      alert(res.data);
      fetchDoctors();
    } catch (err) {
      alert(err.response?.data || "Delete failed");
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchPendingDoctors();
  }, []);

  // ---------- UI ----------
  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>👨‍⚕️ Doctor Management</h1>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* -------- ADD DOCTOR FORM -------- */}
      <div className="admin-form">
        <h3 style={{ marginBottom: '20px', color: 'var(--primary-red)' }}>Add New Doctor</h3>
        <form onSubmit={addDoctor}>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input name="name" placeholder="Enter doctor's name" value={doctorData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>License ID</label>
              <input name="licenseid" placeholder="Enter license ID" value={doctorData.licenseid} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" placeholder="Enter email address" value={doctorData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Contact Number</label>
              <input name="contact" placeholder="Enter contact number" value={doctorData.contact} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Username</label>
              <input name="username" placeholder="Enter username" value={doctorData.username} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="Enter password" value={doctorData.password} onChange={handleChange} required />
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '24px' }}>➕ Add Doctor</button>
        </form>
      </div>

      <div className="divider"></div>

      {/* -------- PENDING APPROVALS -------- */}
      {pendingDoctors.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h2 style={{ marginBottom: '20px', color: 'var(--warning-yellow)' }}>⏳ Pending Doctor Approvals</h2>
          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>License</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Username</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingDoctors.map((d) => (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.name}</td>
                    <td>{d.licenseid}</td>
                    <td>{d.email}</td>
                    <td>{d.contact}</td>
                    <td>{d.username}</td>
                    <td>
                      <button 
                        className="btn-approve" 
                        onClick={() => approveDoctor(d.id)}
                        style={{ marginRight: '8px' }}
                      >
                        ✅ Approve
                      </button>
                      <button 
                        className="btn-reject" 
                        onClick={() => rejectDoctor(d.id)}
                      >
                        ❌ Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="divider"></div>
        </div>
      )}

      {/* -------- VIEW DOCTORS -------- */}
      <div style={{ marginTop: '30px' }}>
        <h2 style={{ marginBottom: '20px' }}>All Doctors</h2>

        {doctors.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👨‍⚕️</div>
            <h3>No Doctors Found</h3>
            <p>Add your first doctor using the form above</p>
          </div>
        ) : (
          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>License</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Username</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((d) => (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.name}</td>
                    <td>{d.licenseid}</td>
                    <td>{d.email}</td>
                    <td>{d.contact}</td>
                    <td>{d.username}</td>
                    <td>
                      <span className={`status-indicator ${d.approved ? 'status-approved' : 'status-pending'}`}>
                        <span className={`status-dot ${d.approved ? 'active' : 'pending'}`}></span>
                        {d.approved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td>
                      <button className="btn-delete" onClick={() => deleteDoctor(d.id)}>🗑️ Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
