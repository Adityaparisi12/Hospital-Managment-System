import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import './admin.css';

export default function AdminPatient() {

  // ---------- STATE ----------
  const [patients, setPatients] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ---------- VIEW ALL PATIENTS ----------
  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${config.url}/admin/viewallpatients`);
      setPatients(res.data);
    } catch (err) {
      setError(err.response?.data || "Failed to fetch patients");
    }
  };

  // ---------- DELETE PATIENT ----------
  const deletePatient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;

    try {
      const res = await axios.delete(
        `${config.url}/admin/deletepatient?pid=${id}`
      );
      alert(res.data);
      fetchPatients();
    } catch (err) {
      alert(err.response?.data || "Delete failed");
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // ---------- UI ----------
  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>👥 Patient Management</h1>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* -------- VIEW PATIENTS -------- */}
      <div style={{ marginTop: '30px' }}>
        <h2 style={{ marginBottom: '20px' }}>All Patients</h2>

        {patients.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No Patients Found</h3>
            <p>Patients register themselves through the patient portal</p>
          </div>
        ) : (
          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Username</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.age}</td>
                    <td>{p.email}</td>
                    <td>{p.contact}</td>
                    <td>{p.username}</td>
                    <td>
                      <button className="btn-delete" onClick={() => deletePatient(p.id)}>🗑️ Delete</button>
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
