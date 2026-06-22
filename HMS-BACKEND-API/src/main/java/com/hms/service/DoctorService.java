package com.hms.service;

import java.util.List;

import com.hms.model.BookAppointment;
import com.hms.model.Doctor;
import com.hms.model.Prescription;
import com.hms.dto.PrescriptionRequest;

public interface DoctorService 
{
	public Doctor checkdoctorlogin(String username, String password);
	public String doctorregistration(Doctor doctor);
	public String doctorupdateprofile(Doctor doctor);
	public String addprescription(Prescription prescription);
	public Prescription addprescription(PrescriptionRequest request);
	public String updatepresciption(Prescription prescription);
	public String deleteprescription(int preid);
	public List<BookAppointment> viewappointments(int did);
	public String acceptappointment(int bid, int did);
	public String rejectappointment(int bid, int did);
	public String completeappointment(int bid, int did);
	public String updateavailability(int did, boolean available);
	

}
