import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import config from '../config'
import './admin.css'

const SORTERS = {
  DATE_DESC: (a, b) => new Date(b.prescriptionDate || 0) - new Date(a.prescriptionDate || 0),
  DATE_ASC: (a, b) => new Date(a.prescriptionDate || 0) - new Date(b.prescriptionDate || 0),
  PATIENT_ASC: (a, b) => (a.patientName || '').localeCompare(b.patientName || ''),
  DOCTOR_ASC: (a, b) => (a.doctorName || '').localeCompare(b.doctorName || '')
}

const formatDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function AdminPrescription() {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)

  const fetchPrescriptions = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.get(`${config.url}/admin/viewallprescriptions`)
      const list = Array.isArray(res.data) ? res.data : []
      setPrescriptions(list)
      if (selected) {
        const refreshed = list.find((item) => item.id === selected.id)
        setSelected(refreshed || null)
      }
    } catch (err) {
      setError(err?.response?.data || 'Unable to fetch prescriptions right now.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrescriptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sortedPrescriptions = useMemo(() => [...prescriptions].sort(SORTERS.DATE_DESC), [prescriptions])

  const handleDownload = (pdfPath) => {
    if (!pdfPath) {
      setError('PDF is not available for this prescription yet.')
      return
    }
    window.open(`${config.url}/downloads/${pdfPath}`, '_blank')
  }

  const handleSelect = (prescription) => {
    setSelected(prescription)
    setTimeout(() => {
      const detail = document.getElementById('prescription-detail')
      if (detail) detail.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>📋 Prescription Management</h1>
        <p style={{ marginTop: '8px', opacity: 0.9 }}>
          Track every prescription issued across the clinic, filter them instantly, and keep audit-ready records.
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}


      <div className="refresh-actions">
        <button className="btn-primary" onClick={fetchPrescriptions} disabled={loading}>
          🔄 Refresh Data
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner" style={{ marginTop: '40px' }}></div>
      ) : sortedPrescriptions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💊</div>
          <h3>No prescriptions to show</h3>
          <p>Newly issued prescriptions will appear here automatically.</p>
        </div>
      ) : (
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Diagnosis</th>
                <th>Medicine</th>
                <th>PDF</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedPrescriptions.map((p) => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td>
                    <div className="table-entity">
                      <strong>{p.patientName || p.patient?.name || 'Unknown'}</strong>
                      <span>Age {p.patientAge || p.patient?.age || '—'} · {p.patientGender || '—'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="table-entity">
                      <strong>{p.doctorName || p.doctor?.name || 'Unknown'}</strong>
                      <span>{p.doctorSpecialization || p.doctor?.specialization || 'General'}</span>
                    </div>
                  </td>
                  <td>{formatDate(p.prescriptionDate)}</td>
                  <td>{p.diagnosis}</td>
                  <td>{p.medicine}</td>
                  <td>
                    <span className={`status-chip ${p.pdfPath ? 'chip-success' : 'chip-warning'}`}>
                      {p.pdfPath ? 'Ready' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group">
                      <button className="btn-link" onClick={() => handleSelect(p)}>
                        🔍 Details
                      </button>
                      <button className="btn-link" onClick={() => handleDownload(p.pdfPath)} disabled={!p.pdfPath}>
                        ⬇️ PDF
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="detail-panel" id="prescription-detail">
          <div className="detail-header">
            <div>
              <p className="detail-eyebrow">Prescription #{selected.id}</p>
              <h3>{selected.patientName || selected.patient?.name || 'Unknown patient'}</h3>
              <p className="detail-subtitle">Issued on {formatDate(selected.prescriptionDate)}</p>
            </div>
            <div className="detail-actions">
              <button className="btn-secondary" onClick={() => setSelected(null)}>
                Close
              </button>
              <button className="btn-primary" onClick={() => handleDownload(selected.pdfPath)} disabled={!selected.pdfPath}>
                Download PDF
              </button>
            </div>
          </div>

          <div className="detail-grid">
            <div>
              <span className="detail-label">Doctor</span>
              <p className="detail-value">{selected.doctorName || selected.doctor?.name || 'Unknown'}</p>
              <p className="detail-meta">{selected.doctorSpecialization || selected.doctor?.specialization || 'General'}</p>
            </div>
            <div>
              <span className="detail-label">Patient Info</span>
              <p className="detail-value">
                {selected.patientName || selected.patient?.name || 'Unknown'} · Age {selected.patientAge || selected.patient?.age || '—'}
              </p>
              <p className="detail-meta">Gender: {selected.patientGender || '—'}</p>
            </div>
            <div>
              <span className="detail-label">Diagnosis</span>
              <p className="detail-value">{selected.diagnosis}</p>
            </div>
            <div>
              <span className="detail-label">Medicine</span>
              <p className="detail-value">{selected.medicine}</p>
            </div>
          </div>

          <div className="detail-grid two-cols">
            <div>
              <span className="detail-label">Dosage</span>
              <p className="detail-value">{selected.dosage}</p>
            </div>
            <div>
              <span className="detail-label">Duration</span>
              <p className="detail-value">{selected.duration}</p>
            </div>
          </div>

          <div className="detail-note">
            <span className="detail-label">Instructions</span>
            <p>{selected.instructions}</p>
          </div>
        </div>
      )}
    </div>
  )
}
