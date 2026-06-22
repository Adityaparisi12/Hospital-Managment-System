package com.hms.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "prescription_table")
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "prescription_id")
    private int id;

    // Relations
    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    // Snapshot data for PDF (VERY IMPORTANT)
    @Column(name = "prescription_pname", length = 100, nullable = false)
    private String patientName;

    @Column(name = "prescription_page", nullable = false)
    private int patientAge;

    @Column(name = "prescription_pgender", nullable = false,length = 10)
    private String patientGender;

    @Column(name = "prescription_dname", nullable = false,length = 20)
    private String doctorName;

    @Column(name = "prescription_dspec", nullable = false,length = 20)
    private String doctorSpecialization;

    // Medical information
    @Column(name = "prescription_diagnosis",nullable = false,length = 100)
    private String diagnosis;
    
    @Column(nullable = false,length = 300)
    private String medicine;
    @Column(nullable = false,length = 300)
    private String dosage;
    @Column(nullable = false,length = 300)
    private String duration;
    @Column(nullable = false,length = 300)
    private String instructions;

    // Date
    @Column(nullable = false)
    private LocalDate prescriptionDate;

    // PDF storage path
    private String pdfPath;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Patient getPatient() {
		return patient;
	}

	public void setPatient(Patient patient) {
		this.patient = patient;
	}

	public Doctor getDoctor() {
		return doctor;
	}

	public void setDoctor(Doctor doctor) {
		this.doctor = doctor;
	}

	public String getPatientName() {
		return patientName;
	}

	public void setPatientName(String patientName) {
		this.patientName = patientName;
	}

	public int getPatientAge() {
		return patientAge;
	}

	public void setPatientAge(int patientAge) {
		this.patientAge = patientAge;
	}

	public String getPatientGender() {
		return patientGender;
	}

	public void setPatientGender(String patientGender) {
		this.patientGender = patientGender;
	}

	public String getDoctorName() {
		return doctorName;
	}

	public void setDoctorName(String doctorName) {
		this.doctorName = doctorName;
	}

	public String getDoctorSpecialization() {
		return doctorSpecialization;
	}

	public void setDoctorSpecialization(String doctorSpecialization) {
		this.doctorSpecialization = doctorSpecialization;
	}

	public String getDiagnosis() {
		return diagnosis;
	}

	public void setDiagnosis(String diagnosis) {
		this.diagnosis = diagnosis;
	}

	public String getMedicine() {
		return medicine;
	}

	public void setMedicine(String medicine) {
		this.medicine = medicine;
	}

	public String getDosage() {
		return dosage;
	}

	public void setDosage(String dosage) {
		this.dosage = dosage;
	}

	public String getDuration() {
		return duration;
	}

	public void setDuration(String duration) {
		this.duration = duration;
	}

	public String getInstructions() {
		return instructions;
	}

	public void setInstructions(String instructions) {
		this.instructions = instructions;
	}

	public LocalDate getPrescriptionDate() {
		return prescriptionDate;
	}

	public void setPrescriptionDate(LocalDate prescriptionDate) {
		this.prescriptionDate = prescriptionDate;
	}

	public String getPdfPath() {
		return pdfPath;
	}

	public void setPdfPath(String pdfPath) {
		this.pdfPath = pdfPath;
	}

 
}
